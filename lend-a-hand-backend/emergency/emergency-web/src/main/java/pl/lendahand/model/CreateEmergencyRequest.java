package pl.lendahand.model;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateEmergencyRequest(
        @NotNull
        UUID id,

        @NotBlank
        @Size(max = 32)
        String title,

        @NotBlank
        @Size(max = 512)
        String description,

        @NotNull
        EmergencyType type,

        @NotNull
        @DecimalMin(value = "-90.0")
        @DecimalMax(value = "90.0")
        @Digits(integer = 2, fraction = 6)
        Double latitude,

        @NotNull
        @DecimalMin(value = "-180.0")
        @DecimalMax(value = "180.0")
        @Digits(integer = 3, fraction = 6)
        Double longitude,

        @NotNull
        @Future
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