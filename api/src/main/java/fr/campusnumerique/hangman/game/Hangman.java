package fr.campusnumerique.hangman.game;

import java.util.ArrayList;
import java.util.List;

/**
 * The rules of the hangman game. Plain Java (no Spring, no database) so it is easy to unit test.
 */
public class Hangman {

    public static final int MAX_ATTEMPTS = 6;

    private final String word;
    private final StringBuilder guessedLetters;

    /**
     * @param word           the word to guess, lowercase letters a-z
     * @param guessedLetters the letters already played, in order (e.g. "eahn")
     */
    public Hangman(String word, String guessedLetters) {
        this.word = word.toLowerCase();
        this.guessedLetters = new StringBuilder(guessedLetters.toLowerCase());
    }

    public Hangman(String word) {
        this(word, "");
    }

    /**
     * Plays a letter. Guessing the same letter twice is free: the state does not change.
     *
     * @throws IllegalArgumentException if the letter is not a-z (case-insensitive)
     * @throws GameFinishedException    if the game is already won or lost
     */
    public void guess(char letter) {
        char lower = Character.toLowerCase(letter);
        if (lower < 'a' || lower > 'z') {
            throw new IllegalArgumentException("A guess must be a single letter a-z");
        }
        if (isFinished()) {
            throw new GameFinishedException();
        }
        if (!hasGuessed(lower)) {
            guessedLetters.append(lower);
        }
    }

    public GameStatus status() {
        if (word.chars().allMatch(c -> hasGuessed((char) c))) {
            return GameStatus.WON;
        }
        if (wrongLetters().size() >= MAX_ATTEMPTS) {
            return GameStatus.LOST;
        }
        return GameStatus.IN_PROGRESS;
    }

    public boolean isFinished() {
        return status() != GameStatus.IN_PROGRESS;
    }

    /** The word with unknown letters replaced by "_", e.g. "H_N_M_N". */
    public String maskedWord() {
        StringBuilder masked = new StringBuilder();
        for (char c : word.toCharArray()) {
            masked.append(hasGuessed(c) ? Character.toUpperCase(c) : '_');
        }
        return masked.toString();
    }

    public List<String> guessedLetters() {
        return guessedLetters.chars().mapToObj(Character::toString).toList();
    }

    public List<String> wrongLetters() {
        List<String> wrong = new ArrayList<>();
        for (String letter : guessedLetters()) {
            if (!word.contains(letter)) {
                wrong.add(letter);
            }
        }
        return wrong;
    }

    public int remainingAttempts() {
        return MAX_ATTEMPTS - wrongLetters().size();
    }

    public String word() {
        return word;
    }

    private boolean hasGuessed(char letter) {
        return guessedLetters.indexOf(String.valueOf(letter)) >= 0;
    }
}
