package pl.lendahand.facade;

import io.vavr.control.Either;
import pl.lendahand.BaseError;
import pl.lendahand.db.VolunteerRepository;
import pl.lendahand.model.Volunteer;

import java.util.List;
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

    public Either<BaseError, UUID> resign(UUID userId, UUID emergencyId) {
        return volunteerRepository.delete(userId, emergencyId);
    }

    public Either<BaseError, Boolean> checkStatus(UUID userId, UUID emergencyId) {
        return volunteerRepository.exists(userId, emergencyId);
    }

    public Either<BaseError, List<Volunteer>> fetchVolunteers(UUID emergencyId) {
        return volunteerRepository.fetchVolunteers(emergencyId).map(volunteerMapper::volunteerEntitiesToVolunteers);
    }
}
