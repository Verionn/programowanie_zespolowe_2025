package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.lendahand.db.EmergencyRepository;
import pl.lendahand.facade.Emergencies;

@Configuration
public class EmergencyConfiguration {

    @Bean
    Emergencies emergencies(EmergencyRepository emergencyRepository){
        return new Emergencies(emergencyRepository);
    }
}
