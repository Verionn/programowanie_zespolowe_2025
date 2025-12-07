package pl.lendahand;

import org.springframework.jdbc.core.RowMapper;
import pl.lendahand.db.model.VolunteerEntity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class VolunteerMapper implements RowMapper<VolunteerEntity> {
    @Override
    public VolunteerEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new VolunteerEntity(
                UUID.fromString(rs.getString(Fields.ID)),
                UUID.fromString(rs.getString(Fields.EMERGENCY_ID)),
                UUID.fromString(rs.getString(Fields.USER_ID))
        );
    }

    private static final class Fields {
        private static final String ID = "id";
        private static final String EMERGENCY_ID = "emergency_id";
        private static final String USER_ID = "user_id";
    }
}
