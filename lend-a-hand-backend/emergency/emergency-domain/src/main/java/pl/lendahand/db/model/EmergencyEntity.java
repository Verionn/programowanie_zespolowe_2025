package pl.lendahand.db.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record EmergencyEntity(
        UUID id,
        UUID userId,
        String title,
        String description,
        EmergencyType type,
        Boolean status,
        Double latitude,
        Double longitude,
        LocalDateTime startDate) {

    public enum EmergencyType {
        FOOD_SUPPLY,
        WATER_SUPPLY,
        MEDICINE_SUPPLY,
        HYGIENE_PRODUCTS,
        REPAIR_ASSISTANCE,
        CLEANUP_ASSISTANCE,
    }
}