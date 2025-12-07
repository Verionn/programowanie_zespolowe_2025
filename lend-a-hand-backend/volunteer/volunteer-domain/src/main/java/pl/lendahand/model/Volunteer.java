package pl.lendahand.model;

import java.util.UUID;

public record Volunteer(
        UUID id,
        UUID userId,
        UUID emergencyId) {
}
