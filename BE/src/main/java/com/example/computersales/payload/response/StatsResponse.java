// src/main/java/com/example/computersales/payload/response/StatsResponse.java
package com.example.computersales.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StatsResponse {

    /** Total number of registered users */
    private long totalUsers;

    /** Sum of all order totals (sales) */
    private double totalSales;

    /** Total number of products in catalog */
    private long totalProducts;

    /** Daily new user counts for the last period */
    private List<DailyCount> newUsers;

    /** Daily new payment (order) counts for the last period */
    private List<DailyCount> newPayments;
}
