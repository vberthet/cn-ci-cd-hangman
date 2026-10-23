package fr.campusnumerique.hangman.stats;

import java.time.LocalDate;
import java.util.List;

public record StatsView(
        long totalGames,
        long won,
        long lost,
        long inProgress,
        double winRate,
        double averageWrongGuesses,
        List<DayStats> gamesPerDay,
        List<WordStats> hardestWords,
        List<PlayerStats> topPlayers) {

    public record DayStats(LocalDate date, long games, long won) {
    }

    public record WordStats(String word, long played, double winRate) {
    }

    public record PlayerStats(String playerName, long won) {
    }
}
