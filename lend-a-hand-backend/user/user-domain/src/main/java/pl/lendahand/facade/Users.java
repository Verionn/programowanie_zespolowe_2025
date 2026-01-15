package pl.lendahand.facade;

import io.vavr.control.Either;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.lendahand.BaseError;
import pl.lendahand.db.UserRepository;
import pl.lendahand.error.UserDomainError;
import pl.lendahand.model.User;
import pl.lendahand.security.JwtService;

import java.util.Objects;
import java.util.UUID;

public class Users {

    private final UserRepository userRepository;
    private final UserMapper USER_MAPPER = UserMapper.INSTANCE;
    private final PasswordEncoder passwordEncoder;

    public Users(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Either<BaseError, User> register(User user) {
        if (userRepository.exists(user.id())) {
            return Either.left(new UserDomainError.UserAlreadyExists());
        }

        return userRepository.save(USER_MAPPER.userToUserEntity(user), passwordEncoder)
                .map(response -> user);
    }

    public Either<BaseError, String> login(
            String email,
            String password,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        return userRepository.findByEmail(email)
                .filterOrElse(Objects::nonNull, error -> new UserDomainError.UserNotFound())
                .map(user -> {
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.id(), password));
                    return jwtService.generateToken(USER_MAPPER.userEntityToUser(user));
                });
    }

    public Either<BaseError, User> getUser(UUID userId) {
        if (!userRepository.exists(userId)) {
            return Either.left(new UserDomainError.UserNotFound());
        }

        return Either.right(USER_MAPPER.userEntityToUser(userRepository.load(userId)));
    }
}
