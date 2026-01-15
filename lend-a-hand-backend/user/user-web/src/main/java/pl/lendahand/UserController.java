package pl.lendahand;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import pl.lendahand.facade.Users;
import pl.lendahand.model.LoginRequest;
import pl.lendahand.model.RegisterRequest;
import pl.lendahand.model.User;
import pl.lendahand.model.UserControllerMapper;
import pl.lendahand.security.JwtService;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class UserController {

    private final JwtService jwtService;
    private final UserControllerMapper userControllerMapper = UserControllerMapper.INSTANCE;
    private final Users users;
    private final AuthenticationManager authenticationManager;

    public UserController(JwtService jwtService, Users users, AuthenticationManager authenticationManager) {
        this.jwtService = jwtService;
        this.users = users;
        this.authenticationManager = authenticationManager;
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

    @PostMapping("/login")
    ResponseEntity<?> login(@Valid @RequestBody LoginRequest authenticationRequest) {
        return users.login(
                        authenticationRequest.email(),
                        authenticationRequest.password(),
                        authenticationManager,
                        jwtService)
                .fold(
                        UserResponseSolver::resolveError,
                        response -> ResponseEntity.status(CREATED).body(
                                userControllerMapper.tokenToAuthenticationResponse(response)
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
