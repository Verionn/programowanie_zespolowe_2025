package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.lendahand.db.UserRepository;
import pl.lendahand.facade.Users;

@Configuration
public class UserConfiguration {

    @Bean
    Users users(UserRepository userRepository, PasswordEncoder passwordEncoder){
        return new Users(userRepository, passwordEncoder);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
