package fr.campusnumerique.hangman.word;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateWordRequest(
        @NotNull @Pattern(regexp = "[a-zA-Z]{3,30}", message = "must contain 3 to 30 letters a-z") String value,
        @NotNull @Pattern(regexp = "[a-zA-Z]{1,30}", message = "must contain 1 to 30 letters a-z") String category) {
}
