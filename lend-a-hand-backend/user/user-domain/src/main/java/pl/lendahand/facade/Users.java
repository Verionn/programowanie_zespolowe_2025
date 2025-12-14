package pl.lendahand.facade;

import io.vavr.control.Either;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.lendahand.BaseError;
import pl.lendahand.db.UserRepository;
import pl.lendahand.error.UserDomainError;
import pl.lendahand.model.User;

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
}
