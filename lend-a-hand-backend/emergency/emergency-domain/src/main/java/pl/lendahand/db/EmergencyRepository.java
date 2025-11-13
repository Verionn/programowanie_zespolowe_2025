package pl.lendahand.db;


import io.vavr.control.Either;
import pl.lendahand.BaseError;
import pl.lendahand.db.model.EmergencyEntity;

import java.util.List;
import java.util.UUID;

public interface EmergencyRepository {

    Either<BaseError, EmergencyEntity> save(EmergencyEntity emergencyEntity);
}
