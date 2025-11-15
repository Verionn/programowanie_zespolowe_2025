package pl.lendahand.facade;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lendahand.db.model.EmergencyEntity;
import pl.lendahand.model.Emergency;

import java.util.List;

@Mapper
public interface EmergencyMapper {
    EmergencyMapper INSTANCE = Mappers.getMapper(EmergencyMapper.class);

    EmergencyEntity emergencyToEmergencyEntity(Emergency emergency);
    Emergency emergencyEntityToEmergency(EmergencyEntity emergencyEntity);
    List<Emergency> emergencyEntitiesToEmergencies(List<EmergencyEntity> emergencyEntities);
}
