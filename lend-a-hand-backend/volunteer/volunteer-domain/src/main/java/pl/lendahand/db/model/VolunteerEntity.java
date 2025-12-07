package pl.lendahand.db.model;

import java.util.UUID;

public record VolunteerEntity(
        UUID id,
        UUID userId,
        UUID emergencyId) {
}
