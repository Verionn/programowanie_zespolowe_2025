package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import pl.lendahand.VolunteerJdbcRepository;
import pl.lendahand.db.VolunteerRepository;

@Configuration
public class VolunteerRepositoryConfiguration {

    @Bean
    VolunteerRepository volunteerRepository(JdbcTemplate jdbcTemplate){
        return new VolunteerJdbcRepository(jdbcTemplate);
    }
}
