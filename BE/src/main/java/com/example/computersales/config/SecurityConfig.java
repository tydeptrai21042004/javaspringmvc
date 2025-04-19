package com.example.computersales.config;

import com.example.computersales.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired private JwtAuthenticationFilter jwtAuthFilter;
    @Autowired private UserRepository        userRepo;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepo.findByUsername(username)
            .map(u -> new org.springframework.security.core.userdetails.User(
                u.getUsername(),
                u.getPassword(),
                List.of(new SimpleGrantedAuthority(u.getRole().name()))
            ))
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public DaoAuthenticationProvider daoAuthProvider(
            UserDetailsService uds,
            PasswordEncoder     encoder
    ) {
        var prov = new DaoAuthenticationProvider();
        prov.setUserDetailsService(uds);
        prov.setPasswordEncoder(encoder);
        return prov;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            HttpSecurity              http,
            DaoAuthenticationProvider daoProvider
    ) throws Exception {
        AuthenticationManagerBuilder auth =
            http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.authenticationProvider(daoProvider);
        return auth.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .cors().and()
          .csrf(cs -> cs.disable())
          .sessionManagement(sm -> sm
              .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .authorizeHttpRequests(auth -> auth
              // public
              .requestMatchers("/api/auth/**").permitAll()
              .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
              .requestMatchers(HttpMethod.GET, "/api/products/*/feedback").permitAll()
              .requestMatchers(HttpMethod.GET,
                  "/api/admin/categories", "/api/admin/brands").permitAll()

              // user ↔ admin chat
              .requestMatchers(HttpMethod.POST, "/api/chat/user/send")
                .hasAnyRole("USER","ADMIN")
              .requestMatchers(HttpMethod.GET,  "/api/chat/user/with-admin")
                .hasAnyRole("USER","ADMIN")

              // admin-only chat management
              .requestMatchers("/api/chat/admin/**")
                .hasRole("ADMIN")

              // everything else under /api/admin
              .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

              // all other endpoints require authentication
              .anyRequest().authenticated()
          )
          .addFilterBefore(jwtAuthFilter,
              UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}