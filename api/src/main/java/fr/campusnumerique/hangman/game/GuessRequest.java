package fr.campusnumerique.hangman.game;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record GuessRequest(
        @NotNull @Pattern(regexp = "[a-zA-Z]", message = "must be a single letter a-z") String letter) {
}
