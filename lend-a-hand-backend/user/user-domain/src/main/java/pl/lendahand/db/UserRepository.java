package pl.lendahand.db;

import io.vavr.control.Either;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.lendahand.BaseError;
import pl.lendahand.db.model.UserEntity;

import java.util.UUID;

public interface UserRepository {

    Either<BaseError, UserEntity> save(UserEntity userEntity, PasswordEncoder passwordEncoder);

    Either<BaseError, UserEntity> findByEmail(String username);

    Either<BaseError, UserEntity> findByUserId(UUID userId);

    UserEntity load(UUID userId);

    Boolean exists(UUID userId);
}
