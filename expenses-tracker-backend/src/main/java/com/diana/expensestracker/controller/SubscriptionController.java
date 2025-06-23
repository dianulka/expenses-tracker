package com.diana.expensestracker.controller;


import com.diana.expensestracker.dto.CancelSubscriptionDto;
import com.diana.expensestracker.dto.MonthlySummaryDto;
import com.diana.expensestracker.model.Subscription;
import com.diana.expensestracker.service.SubscriptionService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;


    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public List<Subscription> getAll() {
        return subscriptionService.getAllSubscriptions();
    }



    @GetMapping("/active")
    public List<Subscription> getActiveSubscriptions() {
        return subscriptionService.getActiveSubscriptions();
    }

    @PostMapping
    public Subscription addSubscription(@RequestBody Subscription subscription) {
        return subscriptionService.addSubscription(subscription);
    }

    @DeleteMapping("/{id}")
    public void deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
    }

    @PutMapping("/{id}")
    public Subscription updateSubscription(@PathVariable Long id, @RequestBody Subscription subscription) {
        return subscriptionService.updateSubscription(id, subscription);
    }

    @PutMapping("/{id}/cancel")
    public Subscription cancelSubscription(@PathVariable Long id, @RequestBody CancelSubscriptionDto dto) {
        return subscriptionService.cancelSubscription(id, dto.getEndDate());
    }

//    @GetMapping("/user/{userId}")
//    public List<Subscription> getSubscriptionsByUserId(@PathVariable Long userId) {
//        return subscriptionService.getSubscriptionsByUserId(userId);
//    }
//
//    @PostMapping("/user/{userId}")
//    public Subscription addSubscription(@PathVariable Long userId, @RequestBody Subscription subscription) {
//        return subscriptionService.addSubscriptionForUserId(userId, subscription);
//    }
//
//    @GetMapping("/user/{userId}/total")
//    public Map<String, BigDecimal> getTotalActivePriceByUserId(@PathVariable Long userId) {
//        BigDecimal total = subscriptionService.getTotalActivePriceByUserId(userId);
//        return Map.of("total", total);
//    }
//
//    @GetMapping("/user/{userId}/summary-by-category")
//    public Map<String,BigDecimal> getSummaryByCategory(@PathVariable Long userId) {
//        return subscriptionService.getTotalPriceByCategoryForUser(userId);
//    }

    @GetMapping("/me")
    public List<Subscription> getMySubscriptions(Authentication auth) {
        return subscriptionService.getSubscriptionsByEmail(auth.getName());
    }

    @PostMapping("/me")
    public Subscription addSubscriptionForCurrentUser(
            @RequestBody Subscription subscription,
            Authentication auth
    ) {
        return subscriptionService.addSubscriptionForEmail(auth.getName(), subscription);
    }

    @GetMapping("/me/total")
    public Map<String, BigDecimal> getTotalActivePrice(Authentication auth) {
        BigDecimal total = subscriptionService.getTotalActivePriceByEmail(auth.getName());
        return Map.of("total", total);
    }

    @GetMapping("/me/summary-by-category")
    public Map<String, BigDecimal> getSummaryByCategory(Authentication auth) {
        return subscriptionService.getTotalPriceByCategoryForEmail(auth.getName());
    }

    @GetMapping("me/monthly-summary")
    public List<MonthlySummaryDto> getMonthlySummary(Authentication auth) {
        return subscriptionService.getMonthlySummaryAsList(auth.getName());
    }


}
