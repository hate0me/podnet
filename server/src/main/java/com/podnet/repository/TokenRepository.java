package com.podnet.repository;

import com.podnet.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query("SELECT t FROM Token t WHERE t.accessToken = :accessToken")
    Optional<Token> findByAccessToken(@Param("accessToken") String accessToken);

    List<Token> findAllByUserIdAndLoggedOutFalse(Long userId);
}