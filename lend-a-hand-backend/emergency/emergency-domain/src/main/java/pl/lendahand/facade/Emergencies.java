package pl.lendahand.facade;

import io.vavr.control.Either;
import pl.lendahand.BaseError;
import pl.lendahand.db.EmergencyRepository;
import pl.lendahand.model.Emergency;

import java.util.List;

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
}
