package com.ripplenexus.salespilot.auth.infrastructure;

import com.ripplenexus.salespilot.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE u.email = :email AND u.deletedAt IS NULL")
    Optional<User> findByEmailWithRolesAndPermissions(String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = :email AND u.deletedAt IS NULL")
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.passwordResetToken = :token AND u.deletedAt IS NULL")
    Optional<User> findByPasswordResetToken(String token);

    @Query("SELECT u FROM User u WHERE u.emailVerifyToken = :token AND u.deletedAt IS NULL")
    Optional<User> findByEmailVerifyToken(String token);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginAt, u.failedLoginAttempts = 0 WHERE u.id = :userId")
    void updateLastLogin(UUID userId, Instant loginAt);

    @Modifying
    @Query("UPDATE User u SET u.failedLoginAttempts = u.failedLoginAttempts + 1 WHERE u.id = :userId")
    void incrementFailedAttempts(UUID userId);

    @Modifying
    @Query("UPDATE User u SET u.lockedUntil = :lockedUntil WHERE u.id = :userId")
    void lockAccount(UUID userId, Instant lockedUntil);
}
