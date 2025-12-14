package pl.lendahand;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import pl.lendahand.db.error.UserError;
import pl.lendahand.error.UserDomainError;

public class UserResponseSolver {

    static String UNKNOWN_ERROR = "An unknown error has occurred";
    static String USER_NOT_FOUND = "User has not been found in the database";
    static String USER_ALREADY_EXISTS = "User with this email already exists in the database";

    public static ResponseEntity<?> resolveError(BaseError error) {
        if (error instanceof UserError.FailedToSaveToDatabaseError) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(UNKNOWN_ERROR);
        } else if (error instanceof UserError.FailedToFetchUserError) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(UNKNOWN_ERROR);
        } else if (error instanceof UserDomainError.UserNotFound) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(USER_NOT_FOUND);
        } else if (error instanceof UserDomainError.UserAlreadyExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(USER_ALREADY_EXISTS);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(UNKNOWN_ERROR);
    }
}
