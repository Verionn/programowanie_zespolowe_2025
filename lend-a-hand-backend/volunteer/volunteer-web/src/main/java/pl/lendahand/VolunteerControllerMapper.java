package pl.lendahand;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lendahand.model.SignUpRequest;
import pl.lendahand.model.Volunteer;

import java.util.UUID;

@Mapper
public interface VolunteerControllerMapper {

    VolunteerControllerMapper INSTANCE = Mappers.getMapper(VolunteerControllerMapper.class);
    Volunteer signUpRequestBodyToVolunteer(SignUpRequest signUpRequest, UUID emergencyId, UUID userId);
}
