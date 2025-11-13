package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import pl.lendahand.EmergencyJdbcRepository;
import pl.lendahand.db.EmergencyRepository;

@Configuration
public class RepositoryConfiguration {

    @Bean
    EmergencyRepository emergencyDatabaseRepository(JdbcTemplate jdbcTemplate){
        return new EmergencyJdbcRepository(jdbcTemplate);
    }
}
