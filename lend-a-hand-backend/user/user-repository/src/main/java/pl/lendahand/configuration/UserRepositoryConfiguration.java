package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import pl.lendahand.UserJdbcRepository;
import pl.lendahand.db.UserRepository;

@Configuration
public class UserRepositoryConfiguration {

    @Bean
    UserRepository userDatabaseRepository(JdbcTemplate jdbcTemplate) {
        return new UserJdbcRepository(jdbcTemplate);
    }
}
