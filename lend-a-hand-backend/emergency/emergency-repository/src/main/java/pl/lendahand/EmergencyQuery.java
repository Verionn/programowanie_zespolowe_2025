package pl.lendahand;

public class EmergencyQuery {

    private static final String EMERGENCY_TABLE = "emergency_emergency";

    public static final String SAVE_EMERGENCY = "INSERT INTO %s VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
            .formatted(EMERGENCY_TABLE);
}
