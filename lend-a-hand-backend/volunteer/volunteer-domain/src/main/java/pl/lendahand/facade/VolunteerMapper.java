package pl.lendahand.facade;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lendahand.db.model.VolunteerEntity;
import pl.lendahand.model.Volunteer;

@Mapper
public interface VolunteerMapper {

    VolunteerMapper INSTANCE = Mappers.getMapper(VolunteerMapper.class);
    VolunteerEntity volunteerToVolunteerEntity(Volunteer volunteer);
    Volunteer volunteerEntityToVolunteer(VolunteerEntity volunteerEntity);
}
