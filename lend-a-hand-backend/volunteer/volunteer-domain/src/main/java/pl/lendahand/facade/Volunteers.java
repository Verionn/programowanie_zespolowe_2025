package pl.lendahand.facade;

import io.vavr.control.Either;
import pl.lendahand.BaseError;
import pl.lendahand.db.VolunteerRepository;
import pl.lendahand.model.Volunteer;

import java.util.Objects;
import java.util.UUID;

public class Volunteers {

    private final VolunteerRepository volunteerRepository;
    private final VolunteerMapper volunteerMapper = VolunteerMapper.INSTANCE;

    public Volunteers(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public Either<BaseError, Volunteer> signUp(Volunteer volunteer) {
        return volunteerRepository.save(volunteerMapper.volunteerToVolunteerEntity(volunteer))
                .map(volunteerMapper::volunteerEntityToVolunteer);
    }
}
