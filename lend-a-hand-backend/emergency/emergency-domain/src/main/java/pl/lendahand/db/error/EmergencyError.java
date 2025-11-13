package pl.lendahand.db.error;

import pl.lendahand.BaseError;

public interface EmergencyError extends BaseError {
    String FAILED_TO_SAVE_TO_DATABASE = "Failed to save entity to the database";

    record FailedToSaveToDatabaseError(String message) implements EmergencyError {
        public FailedToSaveToDatabaseError() {
            this(FAILED_TO_SAVE_TO_DATABASE);
        }
    }
}
