package pl.lendahand;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.lendahand.facade.Volunteers;
import pl.lendahand.model.SignUpRequest;

import java.security.Principal;
import java.util.UUID;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class VolunteerController {

    private final VolunteerControllerMapper volunteerControllerMapper = VolunteerControllerMapper.INSTANCE;
    private final Volunteers volunteers;

    public VolunteerController(Volunteers volunteers) {
        this.volunteers = volunteers;
    }

    @PostMapping("/emergencies/{emergencyId}/signup")
    ResponseEntity<?> signUpToEmergency(@PathVariable("emergencyId") UUID emergencyId,
                                        @Valid @RequestBody SignUpRequest signUpRequest,
                                        Principal principal) {

        return volunteers.signUp(volunteerControllerMapper.signUpRequestBodyToVolunteer(
                        signUpRequest,
                        emergencyId,
                        UUID.fromString(principal.getName())))
                .fold(
                        VolunteerResponseSolver::resolveError,
                        response -> ResponseEntity.status(OK).body(response)
                );
    }

    @DeleteMapping("/emergencies/{emergencyId}/resign")
    ResponseEntity<?> resignFromEmergency(@PathVariable("emergencyId") UUID emergencyId, Principal principal) {
        return volunteers.resign(
                        UUID.fromString(principal.getName()),
                        emergencyId)
                .fold(
                        VolunteerResponseSolver::resolveError,
                        response -> ResponseEntity.status(OK).build()
                );
    }

    @GetMapping("/emergencies/{emergencyId}/status")
    ResponseEntity<?> checkStatus(@PathVariable("emergencyId") UUID emergencyId, Principal principal) {

        return volunteers.checkStatus(
                UUID.fromString(principal.getName()),
                emergencyId
        ).fold(
                VolunteerResponseSolver::resolveError,
                response -> ResponseEntity.status(OK).body(response)
        );
    }

    @GetMapping("/emergencies/{emergencyId}/volunteers")
    ResponseEntity<?> fetchVolunteers(@PathVariable("emergencyId") UUID emergencyId){

        return volunteers.fetchVolunteers(
                emergencyId
        ).fold(
                VolunteerResponseSolver::resolveError,
                response -> ResponseEntity.status(OK).body(response)
        );
    }

}
