package pl.lendahand.db.error;

import pl.lendahand.BaseError;

public interface UserError extends BaseError {

    String FAILED_TO_SAVE_TO_DATABASE = "Failed to save entity to the database";
    String FAILED_TO_FETCH_USER = "Failed to fetch entity from the database";

    record FailedToSaveToDatabaseError(String message) implements UserError {
        public FailedToSaveToDatabaseError() {
            this(FAILED_TO_SAVE_TO_DATABASE);
        }
    }

    record FailedToFetchUserError(String message) implements UserError {
        public FailedToFetchUserError() {
            this(FAILED_TO_FETCH_USER);
        }
    }
}
