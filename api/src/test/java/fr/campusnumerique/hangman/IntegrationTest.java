package fr.campusnumerique.hangman;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import fr.campusnumerique.hangman.game.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Base class for API tests: full application + H2 database.
 * Each test runs in a transaction that is rolled back, so tests do not see each other's data.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class IntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected GameRepository gameRepository;

    /** Starts a game and returns its id. */
    protected long startGame(String playerName) throws Exception {
        String json = mockMvc.perform(post("/api/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"playerName\": \"" + playerName + "\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return ((Number) JsonPath.read(json, "$.id")).longValue();
    }

    /** Peeks at the secret word directly in the database. */
    protected String wordOf(long gameId) {
        return gameRepository.findById(gameId).orElseThrow().getWord().getText();
    }

    protected void guess(long gameId, char letter) throws Exception {
        mockMvc.perform(post("/api/games/{id}/guesses", gameId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"letter\": \"" + letter + "\"}"));
    }

    protected void win(long gameId) throws Exception {
        for (char letter : wordOf(gameId).toCharArray()) {
            guess(gameId, letter);
        }
    }

    protected void lose(long gameId) throws Exception {
        String word = wordOf(gameId);
        int wrongGuesses = 0;
        for (char letter = 'a'; wrongGuesses < 6; letter++) {
            if (word.indexOf(letter) < 0) {
                guess(gameId, letter);
                wrongGuesses++;
            }
        }
    }
}
