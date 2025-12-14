package pl.lendahand.facade;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import pl.lendahand.db.model.UserEntity;
import pl.lendahand.model.User;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserEntity userToUserEntity(User user);

    User userEntityToUser(UserEntity userEntity);
}
