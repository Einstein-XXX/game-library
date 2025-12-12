package com.gamelibrary.repository;

import com.gamelibrary.model.AdminUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends MongoRepository<AdminUser, String> {
    Optional<AdminUser> findByUserId(String userId);
    Boolean existsByUserId(String userId);
}

