package fr.campusnumerique.hangman.word;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface WordRepository extends JpaRepository<Word, Long> {

    List<Word> findByCategory(String category);

    boolean existsByText(String text);

    @Query("select distinct w.category from Word w order by w.category")
    List<String> findCategories();

    /** Words matching the optional filters, with how many times each was played and won. */
    @Query("""
            select new fr.campusnumerique.hangman.word.WordView(
                w.id, w.text, w.category,
                count(g),
                coalesce(sum(case when g.status = fr.campusnumerique.hangman.game.GameStatus.WON then 1 else 0 end), 0))
            from Word w left join Game g on g.word = w
            where (:search is null or w.text like concat('%', :search, '%'))
              and (:category is null or w.category = :category)
            group by w.id, w.text, w.category
            order by w.text
            """)
    List<WordView> search(String search, String category);
}
