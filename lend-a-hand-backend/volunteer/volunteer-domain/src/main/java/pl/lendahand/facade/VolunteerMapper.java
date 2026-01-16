package pl.lendahand.facade;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lendahand.db.model.VolunteerEntity;
import pl.lendahand.model.Volunteer;

import java.util.List;

@Mapper
public interface VolunteerMapper {

    VolunteerMapper INSTANCE = Mappers.getMapper(VolunteerMapper.class);

    VolunteerEntity volunteerToVolunteerEntity(Volunteer volunteer);

    Volunteer volunteerEntityToVolunteer(VolunteerEntity volunteerEntity);

    List<Volunteer> volunteerEntitiesToVolunteers(List<VolunteerEntity> volunteerEntities);
}
