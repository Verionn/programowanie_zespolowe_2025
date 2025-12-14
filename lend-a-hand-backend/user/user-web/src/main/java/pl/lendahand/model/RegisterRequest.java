package pl.lendahand.model;

import jakarta.validation.constraints.*;

public record RegisterRequest(

        @NotBlank
        @Size(max = 32)
        String firstName,

        @NotBlank
        @Size(max = 64)
        String lastName,

        @NotBlank
        @Size(max = 64)
        String password,

        @NotBlank
        @Email
        @Size(max = 32)
        String email,

        @NotBlank
        @Size(max = 9)
        String phoneNumber) {
}

