package pl.lendahand.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record User(
        UUID id,
        String firstName,
        String lastName,
        String password,
        String email,
        String phoneNumber,
        Role role,
        LocalDateTime createdAt) {

    public enum Role {
        ADMIN,
        USER
    }
}
