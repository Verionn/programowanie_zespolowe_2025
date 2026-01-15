package pl.lendahand.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import pl.lendahand.db.UserRepository;
import pl.lendahand.db.model.UserDetailsImpl;
import pl.lendahand.facade.UserMapper;

import java.util.UUID;

@Configuration
public class UserDetailsServiceConfiguration {

    private static final UserMapper USER_MAPPER = UserMapper.INSTANCE;

    @Bean
    UserDetailsService userDetailsService(UserRepository userRepository) {
        return username -> new UserDetailsImpl(USER_MAPPER.userEntityToUser(userRepository.load(UUID.fromString(username))));
    }
}