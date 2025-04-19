package com.example.computersales.repository;

import com.example.computersales.model.Role;
import com.example.computersales.model.User;
import com.example.computersales.payload.response.DailyCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findByRole(Role role);
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query("""
      SELECT new com.example.computersales.payload.response.DailyCount(
        FUNCTION('DATE', u.registrationTime),
        COUNT(u)
      )
      FROM User u
      WHERE u.registrationTime >= CURRENT_DATE - 7
      GROUP BY FUNCTION('DATE', u.registrationTime)
      ORDER BY FUNCTION('DATE', u.registrationTime)
    """
    )
    List<DailyCount> countNewUsersLast7Days();
}