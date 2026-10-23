package fr.campusnumerique.hangman.word;

public record WordView(Long id, String value, String category, long timesPlayed, long timesWon) {
}
