package pl.lendahand;

public class VolunteerQuery {
    private static final String VOLUNTEER_TABLE = "volunteer_volunteer";
    private static final String USER_ID_COLUMN = "user_id";
    private static final String EMERGENCY_ID_COLUMN = "emergency_id";

    public static final String SAVE_VOLUNTEER = "INSERT INTO %s VALUES (?, ?, ?)"
            .formatted(VOLUNTEER_TABLE);

}
