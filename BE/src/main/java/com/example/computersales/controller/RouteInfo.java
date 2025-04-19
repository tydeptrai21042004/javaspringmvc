// src/main/java/com/example/computersales/controller/RouteInfo.java
package com.example.computersales.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteInfo {
    private Set<String> patterns;
    private Set<RequestMethod> methods;
    private String controller;
    private String handler;
}
