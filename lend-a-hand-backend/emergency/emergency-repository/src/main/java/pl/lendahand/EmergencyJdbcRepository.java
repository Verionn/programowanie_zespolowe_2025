package pl.lendahand;

import io.vavr.control.Either;
import io.vavr.control.Try;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import pl.lendahand.db.EmergencyRepository;
import pl.lendahand.db.error.EmergencyError;
import pl.lendahand.db.model.EmergencyEntity;

import java.util.List;
import java.util.UUID;

import static org.springframework.dao.support.DataAccessUtils.singleResult;
import static pl.lendahand.EmergencyQuery.*;

public class EmergencyJdbcRepository implements EmergencyRepository {

    private final static String FAILED_TO_SAVE_EMERGENCY = "Failed to save emergency!";
    private final static String SUCCESSFULLY_SAVED_EMERGENCY = "Successfully saved emergency!";
    private final static String FAILED_TO_FETCH_EMERGENCIES = "Failed to fetch emergencies!";
    private final static String SUCCESSFULLY_FETCHED_EMERGENCIES = "Successfully fetched emergencies!";
    private final static String FAILED_TO_FETCH_EMERGENCY = "Failed to fetch emergency!";
    private final static String SUCCESSFULLY_FETCHED_EMERGENCY = "Successfully fetched emergency!";
    private final Logger LOGGER = LoggerFactory.getLogger(EmergencyJdbcRepository.class);
    private final JdbcTemplate jdbcTemplate;
    private final EmergencyMapper EMERGENCY_MAPPER = new EmergencyMapper();

    public EmergencyJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Either<BaseError, EmergencyEntity> save(EmergencyEntity emergencyEntity) {
        return attemptSave(emergencyEntity)
                .onFailure(error -> LOGGER.warn(FAILED_TO_SAVE_EMERGENCY, error))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_SAVED_EMERGENCY))
                .toEither()
                .map(value -> emergencyEntity)
                .mapLeft(error -> new EmergencyError.FailedToSaveToDatabaseError());
    }

    private Try<Integer> attemptSave(EmergencyEntity emergencyEntity) {
        return Try.of(() -> jdbcTemplate.update(SAVE_EMERGENCY,
                emergencyEntity.id(),
                emergencyEntity.userId(),
                emergencyEntity.title(),
                emergencyEntity.description(),
                emergencyEntity.type().name(),
                emergencyEntity.status(),
                emergencyEntity.latitude(),
                emergencyEntity.longitude(),
                emergencyEntity.startDate()));
    }

    public Either<BaseError, List<EmergencyEntity>> find() {
        return Try.of(() -> jdbcTemplate.query(FETCH_EMERGENCIES, EMERGENCY_MAPPER))
                .onFailure(error -> LOGGER.warn(FAILED_TO_FETCH_EMERGENCIES, error))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_FETCHED_EMERGENCIES))
                .toEither()
                .mapLeft(error -> new EmergencyError.DatabaseReadUnsuccessfulError());
    }

    public Either<BaseError, EmergencyEntity> find(UUID emergencyId) {
        return Try.of(() -> singleResult(jdbcTemplate.query(FETCH_EMERGENCY, EMERGENCY_MAPPER, emergencyId)))
                .onFailure(error -> LOGGER.warn(FAILED_TO_FETCH_EMERGENCY, error))
                .onSuccess(success -> LOGGER.info(SUCCESSFULLY_FETCHED_EMERGENCY))
                .toEither()
                .mapLeft(error -> new EmergencyError.FailedToFetchEmergencyError());
    }
}