package fr.campusnumerique.hangman.word;

import fr.campusnumerique.hangman.error.ConflictException;
import fr.campusnumerique.hangman.error.NotFoundException;
import fr.campusnumerique.hangman.game.GameRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WordService {

    private final WordRepository wordRepository;
    private final GameRepository gameRepository;

    public WordService(WordRepository wordRepository, GameRepository gameRepository) {
        this.wordRepository = wordRepository;
        this.gameRepository = gameRepository;
    }

    @Transactional(readOnly = true)
    public List<WordView> search(String search, String category) {
        return wordRepository.search(normalize(search), normalize(category));
    }

    @Transactional(readOnly = true)
    public List<String> categories() {
        return wordRepository.findCategories();
    }

    public WordView create(String value, String category) {
        String text = value.toLowerCase();
        if (wordRepository.existsByText(text)) {
            throw new ConflictException("The word '" + text + "' already exists");
        }
        Word word = wordRepository.save(new Word(text, category.toLowerCase()));
        return new WordView(word.getId(), word.getText(), word.getCategory(), 0, 0);
    }

    /** Words that have already been played are kept, so that game history and stats stay consistent. */
    public void delete(long id) {
        Word word = wordRepository.findById(id).orElseThrow(() -> new NotFoundException("Word " + id + " not found"));
        if (gameRepository.existsByWord(word)) {
            throw new ConflictException("The word '" + word.getText() + "' has already been played and cannot be deleted");
        }
        wordRepository.delete(word);
    }

    private static String normalize(String filter) {
        return (filter == null || filter.isBlank()) ? null : filter.strip().toLowerCase();
    }
}
