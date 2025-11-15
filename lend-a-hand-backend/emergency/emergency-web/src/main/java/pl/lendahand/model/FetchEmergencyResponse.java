package pl.lendahand.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record FetchEmergencyResponse(UUID id,
                                     UUID userId,
                                     String title,
                                     String description,
                                     Emergency.EmergencyType type,
                                     Boolean status,
                                     Double latitude,
                                     Double longitude,
                                     LocalDateTime startDate) {
}
