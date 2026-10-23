package fr.campusnumerique.hangman.game;

import jakarta.validation.constraints.Size;

public record CreateGameRequest(@Size(max = 50) String playerName) {
}
