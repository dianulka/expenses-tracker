package com.diana.expensestracker.repository;

import com.diana.expensestracker.model.Subscription;
import com.diana.expensestracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    //  tylko aktywne subskrypcje
    List<Subscription> findByActiveTrue();

//    BigDecimal getTotalSubscriptionsPrice();

    List<Subscription> findByUserId(Long userId);

    @Query("SELECT SUM(s.price) FROM Subscription s WHERE s.user.id = :userId AND s.active = true")
    BigDecimal getTotalActivePriceByUserId(@Param("userId") Long userId);

    @Query("SELECT s.category, SUM(s.price) FROM Subscription s where s.user.id = :userId AND s.active = true GROUP BY s.category")
    List<Object[]> getTotalPriceByCategoryForUser(@Param("userId") Long userId);

    List<Subscription> findByUser(User user);

    List<Subscription> findByUserAndActiveTrue(User user);
}

