package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.lendahand.db.VolunteerRepository;
import pl.lendahand.facade.Volunteers;

@Configuration
public class VolunteerDomainConfiguration {

    @Bean
    Volunteers volunteers(VolunteerRepository volunteerRepository){
        return new Volunteers(volunteerRepository);
    }
}
