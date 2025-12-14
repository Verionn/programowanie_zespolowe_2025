package pl.lendahand.error;

import pl.lendahand.BaseError;

public interface UserDomainError extends BaseError {

    String USER_NOT_FOUND = "User not found in the database";
    String USER_ALREADY_EXISTS = "User with this email already exists in the database!";

    record UserNotFound(String message) implements UserDomainError {
        public UserNotFound() {
            this(USER_NOT_FOUND);
        }
    }

    record UserAlreadyExists(String message) implements UserDomainError {
        public UserAlreadyExists() {
            this(USER_ALREADY_EXISTS);
        }
    }

}
