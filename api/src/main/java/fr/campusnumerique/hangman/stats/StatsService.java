package fr.campusnumerique.hangman.stats;

import fr.campusnumerique.hangman.game.Game;
import fr.campusnumerique.hangman.game.GameRepository;
import fr.campusnumerique.hangman.game.GameStatus;
import fr.campusnumerique.hangman.stats.StatsView.DayStats;
import fr.campusnumerique.hangman.stats.StatsView.PlayerStats;
import fr.campusnumerique.hangman.stats.StatsView.WordStats;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Computes the dashboard statistics in memory. Simple and good enough for a demo-sized database.
 */
@Service
public class StatsService {

    static final int DAYS = 14;
    static final int TOP = 5;

    private final GameRepository gameRepository;

    public StatsService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public StatsView compute() {
        List<Game> games = gameRepository.findAllWithWordBy();
        List<Game> finished = games.stream().filter(isFinished()).toList();

        long won = count(games, GameStatus.WON);
        long lost = count(games, GameStatus.LOST);
        double averageWrongGuesses = finished.stream()
                .mapToInt(game -> game.hangman().wrongLetters().size())
                .average()
                .orElse(0);

        return new StatsView(
                games.size(),
                won,
                lost,
                count(games, GameStatus.IN_PROGRESS),
                ratio(won, won + lost),
                round(averageWrongGuesses),
                gamesPerDay(games),
                hardestWords(finished),
                topPlayers(games));
    }

    /** One entry per day for the last 14 days (today included), oldest first. */
    private List<DayStats> gamesPerDay(List<Game> games) {
        Map<LocalDate, List<Game>> byDay = games.stream()
                .collect(Collectors.groupingBy(game -> game.getStartedAt().toLocalDate()));
        LocalDate today = LocalDate.now();
        return Stream.iterate(today.minusDays(DAYS - 1), day -> day.plusDays(1))
                .limit(DAYS)
                .map(day -> {
                    List<Game> ofDay = byDay.getOrDefault(day, List.of());
                    return new DayStats(day, ofDay.size(), count(ofDay, GameStatus.WON));
                })
                .toList();
    }

    /** Words with the lowest win rate among finished games. */
    private List<WordStats> hardestWords(List<Game> finished) {
        Map<String, List<Game>> byWord = finished.stream()
                .collect(Collectors.groupingBy(game -> game.getWord().getText()));
        return byWord.entrySet().stream()
                .map(entry -> {
                    List<Game> played = entry.getValue();
                    return new WordStats(entry.getKey(), played.size(),
                            ratio(count(played, GameStatus.WON), played.size()));
                })
                .sorted(Comparator.comparingDouble(WordStats::winRate)
                        .thenComparing(Comparator.comparingLong(WordStats::played).reversed())
                        .thenComparing(WordStats::word))
                .limit(TOP)
                .toList();
    }

    /** Players with the most won games. */
    private List<PlayerStats> topPlayers(List<Game> games) {
        Map<String, Long> winsByPlayer = games.stream()
                .filter(game -> game.getStatus() == GameStatus.WON)
                .collect(Collectors.groupingBy(Game::getPlayerName, Collectors.counting()));
        return winsByPlayer.entrySet().stream()
                .map(entry -> new PlayerStats(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingLong(PlayerStats::won).reversed()
                        .thenComparing(PlayerStats::playerName))
                .limit(TOP)
                .toList();
    }

    private static Predicate<Game> isFinished() {
        return game -> game.getStatus() != GameStatus.IN_PROGRESS;
    }

    private static long count(List<Game> games, GameStatus status) {
        return games.stream().filter(game -> game.getStatus() == status).count();
    }

    private static double ratio(long part, long total) {
        return total == 0 ? 0 : round((double) part / total);
    }

    private static double round(double value) {
        return Math.round(value * 1000) / 1000.0;
    }
}
