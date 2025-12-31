package pl.lendahand;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.lendahand.facade.Users;
import pl.lendahand.model.RegisterRequest;
import pl.lendahand.model.User;
import pl.lendahand.model.UserControllerMapper;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class UserController {

    private final UserControllerMapper userControllerMapper = UserControllerMapper.INSTANCE;
    private final Users users;

    public UserController(Users users) {
        this.users = users;
    }

    @PostMapping("/registration")
    ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return users.register(userControllerMapper.registerRequestBodyToUser(
                        registerRequest,
                        UUID.randomUUID(),
                        User.Role.USER,
                        LocalDateTime.now()))
                .fold(
                        UserResponseSolver::resolveError,
                        response -> ResponseEntity.status(CREATED).body(
                                userControllerMapper.userToRegisterResponse(response)
                        )
                );
    }

    @GetMapping("/user/{userId}")
    ResponseEntity<?> getUser(@Valid @PathVariable UUID userId) {
        return users.getUser(userId)
                .fold(
                        UserResponseSolver::resolveError,
                        response -> ResponseEntity.status(OK).body(
                                userControllerMapper.userToUserResponse(response)
                        )
                );
    }
}
