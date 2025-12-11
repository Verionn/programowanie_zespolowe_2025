package pl.lendahand.db;

import io.vavr.control.Either;
import pl.lendahand.BaseError;
import pl.lendahand.db.model.VolunteerEntity;

import java.util.UUID;

public interface VolunteerRepository {

    Either<BaseError, VolunteerEntity> save(VolunteerEntity emergencyEntity);

    Either<BaseError, UUID> delete(UUID userId, UUID emergencyId);

    Either<BaseError, Boolean> exists(UUID userId, UUID emergencyId);
}
