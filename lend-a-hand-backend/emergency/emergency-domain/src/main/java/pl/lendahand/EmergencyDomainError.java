package pl.lendahand;

import pl.lendahand.db.error.EmergencyError;

public interface EmergencyDomainError extends BaseError {

    String EMERGENCY_NOT_FOUND = "Emergency not found in the database";

    record EmergencyNotFound(String message) implements EmergencyError {
        public EmergencyNotFound() {
            this(EMERGENCY_NOT_FOUND);
        }
    }

}
