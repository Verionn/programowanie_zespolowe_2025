package pl.lendahand.model;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateEmergencyResponse(UUID id,
                                      UUID userId,
                                      String title,
                                      String description,
                                      String type,
                                      Boolean status,
                                      Double latitude,
                                      Double longitude,
                                      LocalDateTime startDate
) {
}