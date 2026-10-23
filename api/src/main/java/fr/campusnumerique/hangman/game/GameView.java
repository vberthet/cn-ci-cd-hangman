package fr.campusnumerique.hangman.game;

import java.time.LocalDateTime;
import java.util.List;

/** JSON representation of a game. The word is only revealed when asked (e.g. once the game is finished). */
public record GameView(
        Long id,
        String playerName,
        String maskedWord,
        int wordLength,
        List<String> guessedLetters,
        List<String> wrongLetters,
        int remainingAttempts,
        int maxAttempts,
        GameStatus status,
        String word,
        String category,
        LocalDateTime startedAt,
        LocalDateTime finishedAt) {

    public static GameView of(Game game, boolean revealWord) {
        Hangman hangman = game.hangman();
        return new GameView(
                game.getId(),
                game.getPlayerName(),
                hangman.maskedWord(),
                hangman.word().length(),
                hangman.guessedLetters(),
                hangman.wrongLetters(),
                hangman.remainingAttempts(),
                Hangman.MAX_ATTEMPTS,
                game.getStatus(),
                revealWord ? hangman.word() : null,
                game.getWord().getCategory(),
                game.getStartedAt(),
                game.getFinishedAt());
    }

    /** Hides the word while the game is in progress. */
    public static GameView of(Game game) {
        return of(game, game.getStatus() != GameStatus.IN_PROGRESS);
    }
}
