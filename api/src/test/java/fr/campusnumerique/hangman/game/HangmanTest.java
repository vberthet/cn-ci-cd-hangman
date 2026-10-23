package fr.campusnumerique.hangman.game;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class HangmanTest {

    @Test
    void newGameHidesEveryLetter() {
        Hangman hangman = new Hangman("hangman");

        assertThat(hangman.maskedWord()).isEqualTo("_______");
        assertThat(hangman.status()).isEqualTo(GameStatus.IN_PROGRESS);
        assertThat(hangman.remainingAttempts()).isEqualTo(Hangman.MAX_ATTEMPTS);
        assertThat(hangman.guessedLetters()).isEmpty();
    }

    @Test
    void correctGuessRevealsEveryOccurrence() {
        Hangman hangman = new Hangman("hangman");

        hangman.guess('n');

        assertThat(hangman.maskedWord()).isEqualTo("__N___N");
        assertThat(hangman.remainingAttempts()).isEqualTo(6);
        assertThat(hangman.wrongLetters()).isEmpty();
    }

    @Test
    void wrongGuessCostsOneAttempt() {
        Hangman hangman = new Hangman("hangman");

        hangman.guess('e');

        assertThat(hangman.wrongLetters()).containsExactly("e");
        assertThat(hangman.remainingAttempts()).isEqualTo(5);
    }

    @Test
    void guessesAreCaseInsensitive() {
        Hangman hangman = new Hangman("hangman");

        hangman.guess('H');

        assertThat(hangman.maskedWord()).isEqualTo("H______");
        assertThat(hangman.guessedLetters()).containsExactly("h");
    }

    @Test
    void guessingTheSameLetterTwiceIsFree() {
        Hangman hangman = new Hangman("hangman");

        hangman.guess('e');
        hangman.guess('e');
        hangman.guess('E');

        assertThat(hangman.guessedLetters()).containsExactly("e");
        assertThat(hangman.remainingAttempts()).isEqualTo(5);
    }

    @Test
    void findingAllLettersWinsTheGame() {
        Hangman hangman = new Hangman("hangman");

        for (char letter : "hagnm".toCharArray()) {
            hangman.guess(letter);
        }

        assertThat(hangman.status()).isEqualTo(GameStatus.WON);
        assertThat(hangman.maskedWord()).isEqualTo("HANGMAN");
    }

    @Test
    void sixWrongGuessesLoseTheGame() {
        Hangman hangman = new Hangman("hangman");

        for (char letter : "bcdefi".toCharArray()) {
            hangman.guess(letter);
        }

        assertThat(hangman.status()).isEqualTo(GameStatus.LOST);
        assertThat(hangman.remainingAttempts()).isZero();
    }

    @Test
    void cannotGuessOnceTheGameIsFinished() {
        Hangman hangman = new Hangman("cat", "cat");

        assertThatThrownBy(() -> hangman.guess('x')).isInstanceOf(GameFinishedException.class);
    }

    @Test
    void onlyLettersCanBeGuessed() {
        Hangman hangman = new Hangman("hangman");

        assertThatThrownBy(() -> hangman.guess('1')).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> hangman.guess('é')).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void stateIsRebuiltFromPreviousGuesses() {
        Hangman hangman = new Hangman("hangman", "hzx");

        assertThat(hangman.maskedWord()).isEqualTo("H______");
        assertThat(hangman.guessedLetters()).containsExactly("h", "z", "x");
        assertThat(hangman.wrongLetters()).containsExactly("z", "x");
        assertThat(hangman.remainingAttempts()).isEqualTo(4);
    }
}
