package pl.lendahand.db.error;

import pl.lendahand.BaseError;

public interface VolunteerRepositoryError extends BaseError {

    String FAILED_TO_SAVE_TO_DATABASE = "Failed to save entity to the database";
    String FAILED_TO_DELETE_ENTITY__FROM_DATABASE = "Failed to delete entity from the database";
    String FAILED_TO_FETCH_VOLUNTEER = "Failed to fetch entity from the database";
    String FAILED_TO_FETCH_VOLUNTEERS = "Failed to fetch entities from the database";

    record FailedToSaveToDatabaseError(String message) implements VolunteerRepositoryError {
        public FailedToSaveToDatabaseError() {
            this(FAILED_TO_SAVE_TO_DATABASE);
        }
    }

    record FailedToDeleteToDatabaseError(String message) implements VolunteerRepositoryError {
        public FailedToDeleteToDatabaseError() {
            this(FAILED_TO_DELETE_ENTITY__FROM_DATABASE);
        }
    }

    record FailedToFetchVolunteer(String message) implements VolunteerRepositoryError {
        public FailedToFetchVolunteer() {
            this(FAILED_TO_FETCH_VOLUNTEER);
        }
    }

    record FailedToFetchVolunteers(String message) implements VolunteerRepositoryError {
        public FailedToFetchVolunteers() {
            this(FAILED_TO_FETCH_VOLUNTEERS);
        }
    }
}
