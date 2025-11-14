package pl.lendahand;

import org.springframework.jdbc.core.RowMapper;
import pl.lendahand.db.model.EmergencyEntity;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

public class EmergencyMapper implements RowMapper<EmergencyEntity> {
    @Override
    public EmergencyEntity mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new EmergencyEntity(
                UUID.fromString(rs.getString(Fields.ID)),
                UUID.fromString(rs.getString(Fields.USER_ID)),
                rs.getString(Fields.TITLE),
                rs.getString(Fields.DESCRIPTION),
                EmergencyEntity.EmergencyType.valueOf(rs.getString(Fields.TYPE)),
                rs.getBoolean(Fields.STATUS),
                rs.getDouble(Fields.LATITUDE),
                rs.getDouble(Fields.LONGITUDE),
                rs.getTimestamp(Fields.START_DATE).toLocalDateTime()
        );
    }

    private static final class Fields {
        private static final String ID = "id";
        private static final String USER_ID = "user_id";
        private static final String TITLE = "title";
        private static final String DESCRIPTION = "description";
        private static final String TYPE = "type";
        private static final String STATUS = "status";
        private static final String LATITUDE = "latitude";
        private static final String LONGITUDE = "longitude";
        private static final String START_DATE = "start_date";
    }
}