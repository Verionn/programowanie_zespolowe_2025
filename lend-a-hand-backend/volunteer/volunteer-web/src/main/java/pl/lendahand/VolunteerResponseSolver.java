package pl.lendahand;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import pl.lendahand.db.error.VolunteerRepositoryError;

public class VolunteerResponseSolver {

    static String UNKNOWN_ERROR = "An unknown error has occurred";

    public static ResponseEntity<?> resolveError(BaseError error) {
        if (error instanceof VolunteerRepositoryError.FailedToSaveToDatabaseError) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(UNKNOWN_ERROR);
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(UNKNOWN_ERROR);
    }
}
