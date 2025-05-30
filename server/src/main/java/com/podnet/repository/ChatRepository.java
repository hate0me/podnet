package com.podnet.repository;

import com.podnet.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    @Query("SELECT DISTINCT c FROM Chat c JOIN c.participants p WHERE p.id = :userId")
    List<Chat> findByParticipantsId(@Param("userId") Long userId);
}