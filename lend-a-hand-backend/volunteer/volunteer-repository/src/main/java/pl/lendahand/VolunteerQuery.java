package pl.lendahand;

public class VolunteerQuery {
    private static final String VOLUNTEER_TABLE = "volunteer_volunteer";
    private static final String USER_ID_COLUMN = "user_id";
    private static final String EMERGENCY_ID_COLUMN = "emergency_id";

    public static final String SAVE_VOLUNTEER = "INSERT INTO %s VALUES (?, ?, ?)"
            .formatted(VOLUNTEER_TABLE);

    public static final String DELETE_VOLUNTEER = "DELETE FROM %s WHERE %s = ? AND %s = ?"
            .formatted(VOLUNTEER_TABLE, USER_ID_COLUMN, EMERGENCY_ID_COLUMN);

    public static final String FIND_VOLUNTEER = "SELECT EXISTS(SELECT 1 FROM %s WHERE %s = ? AND %s = ?)"
            .formatted(VOLUNTEER_TABLE, USER_ID_COLUMN, EMERGENCY_ID_COLUMN);
}