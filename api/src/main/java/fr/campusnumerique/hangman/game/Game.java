package fr.campusnumerique.hangman.game;

import fr.campusnumerique.hangman.word.Word;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playerName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Word word;

    private String guessedLetters;

    // Stored as plain VARCHAR (Hibernate would otherwise expect a native MySQL ENUM column).
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private GameStatus status;

    private LocalDateTime startedAt;

    private LocalDateTime finishedAt;

    protected Game() {
        // required by JPA
    }

    public Game(String playerName, Word word) {
        this.playerName = playerName;
        this.word = word;
        this.guessedLetters = "";
        this.status = GameStatus.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    /** Applies a guess using the game rules, then stores the new state. */
    public void guess(char letter) {
        Hangman hangman = hangman();
        hangman.guess(letter);
        guessedLetters = String.join("", hangman.guessedLetters());
        status = hangman.status();
        if (hangman.isFinished()) {
            finishedAt = LocalDateTime.now();
        }
    }

    public Hangman hangman() {
        return new Hangman(word.getText(), guessedLetters);
    }

    public Long getId() {
        return id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public Word getWord() {
        return word;
    }

    public GameStatus getStatus() {
        return status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }
}
