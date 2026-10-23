package fr.campusnumerique.hangman.game;

import fr.campusnumerique.hangman.word.Word;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {

    @EntityGraph(attributePaths = "word")
    List<Game> findAllByOrderByStartedAtDescIdDesc(Pageable pageable);

    @EntityGraph(attributePaths = "word")
    List<Game> findAllWithWordBy();

    boolean existsByWord(Word word);
}
