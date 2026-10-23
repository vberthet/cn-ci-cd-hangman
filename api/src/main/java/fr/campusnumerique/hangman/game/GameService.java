package fr.campusnumerique.hangman.game;

import fr.campusnumerique.hangman.error.NotFoundException;
import fr.campusnumerique.hangman.word.Word;
import fr.campusnumerique.hangman.word.WordRepository;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GameService {

    private static final String DEFAULT_PLAYER_NAME = "Anonymous";

    private final GameRepository gameRepository;
    private final WordRepository wordRepository;

    public GameService(GameRepository gameRepository, WordRepository wordRepository) {
        this.gameRepository = gameRepository;
        this.wordRepository = wordRepository;
    }

    /** Starts a game with a random word, optionally from the given category. */
    public GameView start(String playerName, String category) {
        List<Word> words = category == null
                ? wordRepository.findAll()
                : wordRepository.findByCategory(category.toLowerCase());
        if (words.isEmpty()) {
            throw new NotFoundException("No word available" + (category == null ? "" : " in category " + category));
        }
        Word word = words.get(ThreadLocalRandom.current().nextInt(words.size()));

        String name = (playerName == null || playerName.isBlank()) ? DEFAULT_PLAYER_NAME : playerName.strip();
        return GameView.of(gameRepository.save(new Game(name, word)));
    }

    @Transactional(readOnly = true)
    public GameView get(long id) {
        return GameView.of(find(id));
    }

    public GameView guess(long id, char letter) {
        Game game = find(id);
        game.guess(letter);
        return GameView.of(game);
    }

    /** Most recent games first, with the word revealed (used by the dashboard). */
    @Transactional(readOnly = true)
    public List<GameView> recent(int limit) {
        return gameRepository.findAllByOrderByStartedAtDescIdDesc(PageRequest.of(0, limit)).stream()
                .map(game -> GameView.of(game, true))
                .toList();
    }

    private Game find(long id) {
        return gameRepository.findById(id).orElseThrow(() -> new NotFoundException("Game " + id + " not found"));
    }
}
