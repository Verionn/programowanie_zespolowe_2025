package pl.lendahand.model;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper
public interface EmergencyControllerMapper {
    EmergencyControllerMapper INSTANCE = Mappers.getMapper(EmergencyControllerMapper.class);

    Emergency createRequestBodyToEmergency(CreateEmergencyRequest createRequestRequest, UUID userId, boolean status);

    CreateEmergencyResponse emergencyToCreateEmergencyResponse(Emergency emergency);

}
