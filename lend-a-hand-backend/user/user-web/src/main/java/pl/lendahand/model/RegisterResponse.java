package pl.lendahand.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record RegisterResponse(UUID id,
                               String firstName,
                               String lastName,
                               String password,
                               String email,
                               String phoneNumber,
                               String role,
                               LocalDateTime createdAt) {
}