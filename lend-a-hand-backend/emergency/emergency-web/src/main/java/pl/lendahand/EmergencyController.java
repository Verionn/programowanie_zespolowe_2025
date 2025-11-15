package pl.lendahand;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.lendahand.facade.Emergencies;
import pl.lendahand.model.CreateEmergencyRequest;
import pl.lendahand.model.EmergencyControllerMapper;

import java.security.Principal;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class EmergencyController {

    private final EmergencyControllerMapper emergencyControllerMapper = EmergencyControllerMapper.INSTANCE;
    private final Emergencies emergencies;

    public EmergencyController(Emergencies emergencies) {
        this.emergencies = emergencies;
    }

    @PostMapping("/emergencies")
    ResponseEntity<?> createEmergency(@Valid @RequestBody CreateEmergencyRequest createEmergencyRequest, Principal principal) {
        return emergencies.createEmergency(emergencyControllerMapper.createRequestBodyToEmergency(
                        createEmergencyRequest,
                        UUID.fromString(principal.getName()),
                        false))
                .fold(
                        EmergencyResponseSolver::resolveError,
                        response -> ResponseEntity.status(CREATED).body(
                                emergencyControllerMapper.emergencyToCreateEmergencyResponse(response)
                        )
                );
    }

    @GetMapping("/emergencies")
    ResponseEntity<?> fetchEmergencies() {
        return emergencies.fetchEmergencies().fold(
                EmergencyResponseSolver::resolveError,
                response -> ResponseEntity.status(OK).body(
                        emergencyControllerMapper.emergenciesToFetchEmergenciesResponse(response))
        );
    }

    @GetMapping("/emergencies/{emergencyId}")
    ResponseEntity<?> fetchEmergency(@PathVariable("emergencyId") UUID emergencyId) {
        return emergencies.fetchEmergency(emergencyId).fold(
                EmergencyResponseSolver::resolveError,
                response -> ResponseEntity.status(OK).body(
                        emergencyControllerMapper.emergencyToFetchEmergencyResponse(response))
        );
    }
}
