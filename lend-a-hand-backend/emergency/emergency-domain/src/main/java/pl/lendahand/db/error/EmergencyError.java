package pl.lendahand.db.error;

import pl.lendahand.BaseError;

public interface EmergencyError extends BaseError {

    String FAILED_TO_FETCH_EMERGENCY = "Failed to fetch entity from the database";
    String FAILED_TO_DELETE_EMERGENCY = "Failed to delete entity from the database";
    String FAILED_TO_SAVE_TO_DATABASE = "Failed to save entity to the database";
    String UNSUCCESSFUL_DATABASE_READ = "The attempt to read from the database was unsuccessful";

    record FailedToSaveToDatabaseError(String message) implements EmergencyError {
        public FailedToSaveToDatabaseError() {
            this(FAILED_TO_SAVE_TO_DATABASE);
        }
    }

    record DatabaseReadUnsuccessfulError(String message) implements EmergencyError {
        public DatabaseReadUnsuccessfulError() {
            this(UNSUCCESSFUL_DATABASE_READ);
        }
    }

    record FailedToFetchEmergencyError(String message) implements EmergencyError {
        public FailedToFetchEmergencyError() {
            this(FAILED_TO_FETCH_EMERGENCY);
        }
    }

    record FailedToDeleteEmergencyError(String message) implements EmergencyError {
        public FailedToDeleteEmergencyError(){
            this(FAILED_TO_DELETE_EMERGENCY);
        }
    }
}
