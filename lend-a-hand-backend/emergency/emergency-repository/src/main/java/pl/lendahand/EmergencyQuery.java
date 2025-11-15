package pl.lendahand;

public class EmergencyQuery {

    private static final String EMERGENCY_TABLE = "emergency_emergency";
    private static final String ID_COLUMN = "id";

    public static final String SAVE_EMERGENCY = "INSERT INTO %s VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
            .formatted(EMERGENCY_TABLE);

    public static final String FETCH_EMERGENCIES = "SELECT * FROM %s"
            .formatted(EMERGENCY_TABLE);

    public static final String FETCH_EMERGENCY = "SELECT * FROM %s WHERE %s = ?"
            .formatted(EMERGENCY_TABLE, ID_COLUMN);
}
