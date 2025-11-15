package pl.lendahand.facade;

import io.vavr.control.Either;
import pl.lendahand.BaseError;
import pl.lendahand.EmergencyDomainError;
import pl.lendahand.db.EmergencyRepository;
import pl.lendahand.model.Emergency;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class Emergencies {

    private final EmergencyRepository emergencyRepository;
    private final EmergencyMapper emergencyMapper = EmergencyMapper.INSTANCE;

    public Emergencies(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    public Either<BaseError, Emergency> createEmergency(Emergency emergency) {
        return emergencyRepository.save(emergencyMapper.emergencyToEmergencyEntity(emergency))
                .map(response -> emergency);
    }

    public Either<BaseError, List<Emergency>> fetchEmergencies() {
        return emergencyRepository.find()
                .map(emergencyMapper::emergencyEntitiesToEmergencies);

    }

    public Either<BaseError, Emergency> fetchEmergency(UUID emergencyId) {
        return emergencyRepository.find(emergencyId)
                .filterOrElse(Objects::nonNull, error -> new EmergencyDomainError.EmergencyNotFound())
                .map(emergencyMapper::emergencyEntityToEmergency);
    }

    public Either<BaseError, UUID> deleteEmergency(UUID emergencyId) {
        return emergencyRepository.delete(emergencyId);
    }
}
