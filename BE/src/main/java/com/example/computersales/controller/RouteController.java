// src/main/java/com/example/computersales/controller/RouteController.java
package com.example.computersales.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.RequestMappingInfoHandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class RouteController {

    private final RequestMappingHandlerMapping handlerMapping;

    @Autowired
    public RouteController(RequestMappingHandlerMapping handlerMapping) {
        this.handlerMapping = handlerMapping;
    }

    @GetMapping("/routes")
    public List<RouteInfo> allRoutes() {
        return handlerMapping.getHandlerMethods().entrySet().stream()
            .map(entry -> {
                RequestMappingInfo info   = entry.getKey();
                HandlerMethod       method = entry.getValue();

                // collect URL patterns from either PatternsCondition or PathPatternsCondition
                Set<String> patterns = new LinkedHashSet<>();
                if (info.getPatternsCondition() != null) {
                    patterns.addAll(info.getPatternsCondition().getPatterns());
                }
                if (info.getPathPatternsCondition() != null) {
                    patterns.addAll(info.getPathPatternsCondition().getPatternValues());
                }

                // collect HTTP methods (may be empty = allow all)
                Set<RequestMethod> methods = Optional.ofNullable(info.getMethodsCondition())
                                                     .map(c -> c.getMethods())
                                                     .orElse(Collections.emptySet());

                return new RouteInfo(
                    patterns,
                    methods,
                    method.getBeanType().getSimpleName(),
                    method.getMethod().getName()
                );
            })
            .collect(Collectors.toList());
    }
}
