// src/main/java/com/example/computersales/payload/response/DailyCount.java
package com.example.computersales.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class DailyCount {
    private Date date;
    private long count;
}
