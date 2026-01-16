package pl.lendahand;

import io.vavr.control.Either;
import io.vavr.control.Try;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import pl.lendahand.db.VolunteerRepository;
import pl.lendahand.db.error.VolunteerRepositoryError;
import pl.lendahand.db.model.VolunteerEntity;

import java.util.List;
import java.util.UUID;

import static pl.lendahand.VolunteerQuery.*;

public class VolunteerJdbcRepository implements VolunteerRepository {

    private final static String FAILED_TO_SAVE_VOLUNTEER = "Failed to save volunteer!";
    private final static String SUCCESSFULLY_SAVED_VOLUNTEER = "Successfully saved volunteer!";
    private final static String FAILED_TO_DELETE_VOLUNTEER = "Failed to delete volunteer!";
    private final static String SUCCESSFULLY_DELETED_VOLUNTEER = "Successfully deleted volunteer!";
    private final static String SUCCESSFULLY_FOUND_VOLUNTEER = "Successfully found volunteer!";
    private final static String SUCCESSFULLY_FETCHED_VOLUNTEERS = "Successfully fetched volunteers!";
    private final static String FAILED_TO_FIND_VOLUNTEER = "Failed to find volunteer!";
    private final static String FAILED_TO_FETCH_VOLUNTEERS = "Failed to fetch volunteers!";
    private final Logger LOGGER = LoggerFactory.getLogger(VolunteerJdbcRepository.class);
    private final JdbcTemplate jdbcTemplate;
    private final VolunteerMapper VOLUNTEER_MAPPER = new VolunteerMapper();

    public VolunteerJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Either<BaseError, VolunteerEntity> save(VolunteerEntity volunteerEntity) {
        return attemptSave(volunteerEntity)
                .onFailure(error -> LOGGER.warn(FAILED_TO_SAVE_VOLUNTEER, error))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_SAVED_VOLUNTEER))
                .toEither()
                .map(value -> volunteerEntity)
                .mapLeft(error -> new VolunteerRepositoryError.FailedToSaveToDatabaseError());
    }

    public Either<BaseError, UUID> delete(UUID userId, UUID emergencyId) {
        return attemptDelete(userId, emergencyId)
                .onFailure(error -> LOGGER.warn(FAILED_TO_DELETE_VOLUNTEER, error))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_DELETED_VOLUNTEER))
                .toEither()
                .map(value -> userId)
                .mapLeft(error -> new VolunteerRepositoryError.FailedToDeleteToDatabaseError());
    }

    @Override
    public Either<BaseError, Boolean> exists(UUID userId, UUID emergencyId) {
        return Try.of(() -> jdbcTemplate.queryForObject(FIND_VOLUNTEER, Boolean.class, userId, emergencyId))
                .onFailure(error -> LOGGER.warn(FAILED_TO_FIND_VOLUNTEER))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_FOUND_VOLUNTEER))
                .toEither()
                .mapLeft(error -> new VolunteerRepositoryError.FailedToFetchVolunteer());
    }

    @Override
    public Either<BaseError, List<VolunteerEntity>> fetchVolunteers(UUID emergencyId) {
        return Try.of(() -> jdbcTemplate.query(FETCH_VOLUNTEERS, VOLUNTEER_MAPPER, emergencyId))
                .onFailure(error -> LOGGER.warn(FAILED_TO_FETCH_VOLUNTEERS, error))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_FETCHED_VOLUNTEERS))
                .toEither()
                .mapLeft(error -> new VolunteerRepositoryError.FailedToFetchVolunteers());
    }

    private Try<Integer> attemptSave(VolunteerEntity volunteerEntity) {
        return Try.of(() -> jdbcTemplate.update(SAVE_VOLUNTEER,
                volunteerEntity.id(),
                volunteerEntity.userId(),
                volunteerEntity.emergencyId()
        ));
    }

    private Try<Integer> attemptDelete(UUID userId, UUID emergencyId) {
        return Try.of(() -> jdbcTemplate.update(DELETE_VOLUNTEER, userId, emergencyId));
    }
}
