package com.example.pfegestionsportive.repository;

import com.example.pfegestionsportive.model.entity.Message;
import com.example.pfegestionsportive.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    List<Message> findByReceiverOrderByDateEnvoiDesc(User receiver);
    Long countByReceiverAndLuFalse(User receiver);
}