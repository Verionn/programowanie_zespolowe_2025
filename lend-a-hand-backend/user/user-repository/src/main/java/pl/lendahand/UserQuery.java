package pl.lendahand;

public class UserQuery {

    private static final String USER_TABLE = "user_user";
    private static final String ID_COLUMN = "id";
    private static final String EMAIL_COLUMN = "email";

    public static final String SAVE_USER = "INSERT INTO %s VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            .formatted(USER_TABLE);

    public static final String FETCH_USER_BY_USER_ID = "SELECT * FROM %s WHERE %s = ?"
            .formatted(USER_TABLE, ID_COLUMN);
    public static final String FETCH_USER_BY_EMAIL = "SELECT * FROM %s WHERE %s = ?"
            .formatted(USER_TABLE, EMAIL_COLUMN);
}
