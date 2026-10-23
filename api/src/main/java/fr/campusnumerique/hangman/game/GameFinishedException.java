package fr.campusnumerique.hangman.game;

public class GameFinishedException extends RuntimeException {

    public GameFinishedException() {
        super("The game is already finished");
    }
}
