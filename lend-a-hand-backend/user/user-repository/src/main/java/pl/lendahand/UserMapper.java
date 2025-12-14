package pl.lendahand;

import org.springframework.jdbc.core.RowMapper;
import pl.lendahand.db.model.UserEntity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class UserMapper implements RowMapper<UserEntity> {
    @Override
    public UserEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new UserEntity(
                UUID.fromString(rs.getString(Fields.ID)),
                rs.getString(Fields.FIRST_NAME),
                rs.getString(Fields.LAST_NAME),
                rs.getString(Fields.PASSWORD),
                rs.getString(Fields.EMAIL),
                rs.getString(Fields.PHONE_NUMBER),
                UserEntity.Role.valueOf(rs.getString(Fields.ROLE)),
                rs.getTimestamp(Fields.CREATED_AT).toLocalDateTime()
        );
    }

    private static final class Fields {
        private static final String ID = "id";
        private static final String FIRST_NAME = "first_name";
        private static final String LAST_NAME = "last_name";
        private static final String PASSWORD = "password";
        private static final String EMAIL = "email";
        private static final String PHONE_NUMBER = "phone_number";
        private static final String ROLE = "role";
        private static final String CREATED_AT = "created_at";
    }
}
