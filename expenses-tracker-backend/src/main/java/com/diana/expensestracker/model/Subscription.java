package com.diana.expensestracker.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;


    private BigDecimal price;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean active;

    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Subscription(String name, BigDecimal price, LocalDate startDate, boolean active, String category) {
        this.name = name;
        this.price = price;
        this.startDate = startDate;
        this.active = active;
        this.category = category;
    }

    public Subscription() {

    }

    // GET
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public boolean isActive() {
        return active;
    }

//    public Long getUser() {
//        return user.getId();
//    }

    public LocalDate getEndDate() {
        return endDate;
    }


    public String getCategory() {
        return category;
    }

    //SEt
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
