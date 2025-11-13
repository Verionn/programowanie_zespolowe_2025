package pl.lendahand;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public record EmergencyResponseSolver() {

    static String UNKNOWN_ERROR = "An unknown error has occurred";

    public static ResponseEntity<?> resolveError(BaseError error) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(UNKNOWN_ERROR);
    }
}
