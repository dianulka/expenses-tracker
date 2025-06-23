package com.diana.expensestracker.service;


import com.diana.expensestracker.dto.MonthlySummaryDto;
import com.diana.expensestracker.model.Subscription;
import com.diana.expensestracker.model.User;
import com.diana.expensestracker.repository.SubscriptionRepository;
import com.diana.expensestracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// połączy się z SubscribtionRepository
// da kontrolerowi metodę która pobierze subskrybcje z bazy
@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    SubscriptionService(SubscriptionRepository subscriptionRepository, UserRepository userRepository){
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    public List<Subscription> getAllSubscriptions(){
        return subscriptionRepository.findAll();

    }

    public List<Subscription> getActiveSubscriptions(){
        return subscriptionRepository.findByActiveTrue();
    }

    public Subscription addSubscription(Subscription subscription){
        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Long id){
        if (!subscriptionRepository.existsById(id)) {
            throw new RuntimeException("Subskrypcja nie istnieje");
        }
        subscriptionRepository.deleteById(id);
    }

    public Subscription updateSubscription(Long id, Subscription subscription){
        if (!subscriptionRepository.existsById(id)) {
            throw new RuntimeException("Subskrypcja nie istnieje");
        }
        return subscriptionRepository.save(subscription);
    }

    public List<Subscription> getSubscriptionsByUserId(Long userId){
        return subscriptionRepository.findByUserId(userId);
    }

    public Subscription addSubscriptionForUserId(Long userId, Subscription subscription){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));

        subscription.setUser(user);
        return subscriptionRepository.save(subscription);
    }

    public BigDecimal getTotalActivePriceByUserId(Long userId) {
        BigDecimal total = subscriptionRepository.getTotalActivePriceByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public Map<String, BigDecimal> getTotalPriceByCategoryForUser(Long userId){

        List<Object[]> results = subscriptionRepository.getTotalPriceByCategoryForUser(userId);

        Map<String, BigDecimal> summary = new HashMap<>();

        for (Object[] row :results) {
            String category = (String) row[0];
            BigDecimal price = (BigDecimal) row[1];
            summary.put(category, price);
        }
        return summary;
    }

    public List<Subscription> getSubscriptionsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return subscriptionRepository.findByUser(user);
    }

    public Subscription addSubscriptionForEmail(String email, Subscription subscription) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        subscription.setUser(user);
        return subscriptionRepository.save(subscription);
    }

    public BigDecimal getTotalActivePriceByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findByUserAndActiveTrue(user)
                .stream()
                .map(Subscription::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Map<String, BigDecimal> getTotalPriceByCategoryForEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return subscriptionRepository.findByUser(user)
                .stream()
                .collect(Collectors.groupingBy(
                        Subscription::getCategory,
                        Collectors.mapping(
                                Subscription::getPrice,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));
    }

    public List<MonthlySummaryDto> getMonthlySummaryAsList(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, BigDecimal> grouped = user.getSubscriptions().stream()
                .filter(subscription -> {
                    LocalDate now = LocalDate.now();
                    return !subscription.getStartDate().isAfter(now);
                })
                .flatMap(subscription -> {
                    LocalDate start = subscription.getStartDate().withDayOfMonth(1);
                    LocalDate end = (subscription.getEndDate() != null)
                            ? subscription.getEndDate().withDayOfMonth(1)
                            : LocalDate.now().withDayOfMonth(1);

                    long months = ChronoUnit.MONTHS.between(start, end) + 1;

                    return Stream.iterate(start, date -> date.plusMonths(1))
                            .limit(months)
                            .map(date -> Map.entry(
                                    date.getYear() + "-" + String.format("%02d", date.getMonthValue()),
                                    subscription.getPrice()
                            ));
                })
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        BigDecimal::add
                ));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new MonthlySummaryDto(entry.getKey(), entry.getValue()))
                .toList();
    }


    public Subscription cancelSubscription(Long id, String endDate) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));

        subscription.setActive(false);
        subscription.setEndDate(LocalDate.parse(endDate));

        return subscriptionRepository.save(subscription);
    }

}
