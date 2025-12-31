package pl.lendahand.model;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.util.UUID;

@Mapper
public interface UserControllerMapper {

    UserControllerMapper INSTANCE = Mappers.getMapper(UserControllerMapper.class);

    User registerRequestBodyToUser(RegisterRequest createUserRequest, UUID id, User.Role role, LocalDateTime createdAt);

    RegisterResponse userToRegisterResponse(User user);

    UserResponse userToUserResponse(User user);
}
