package fr.campusnumerique.hangman.game;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.matchesPattern;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.campusnumerique.hangman.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;

class GameApiTest extends IntegrationTest {

    @Test
    void startsAGameWithAHiddenWord() throws Exception {
        mockMvc.perform(post("/api/games")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"playerName\": \"Alice\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.playerName").value("Alice"))
                .andExpect(jsonPath("$.maskedWord").value(matchesPattern("_+")))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.remainingAttempts").value(6))
                .andExpect(jsonPath("$.maxAttempts").value(6))
                .andExpect(jsonPath("$.guessedLetters", hasSize(0)))
                .andExpect(jsonPath("$.word").value(nullValue()))
                .andExpect(jsonPath("$.startedAt").isNotEmpty())
                .andExpect(jsonPath("$.finishedAt").value(nullValue()));
    }

    @Test
    void playerNameIsOptional() throws Exception {
        mockMvc.perform(post("/api/games"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.playerName").value("Anonymous"));
    }

    @Test
    void canPickTheCategory() throws Exception {
        mockMvc.perform(post("/api/games").param("category", "animals"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.category").value("animals"));
    }

    @Test
    void unknownCategoryReturns404() throws Exception {
        mockMvc.perform(post("/api/games").param("category", "dinosaurs"))
                .andExpect(status().isNotFound());
    }

    @Test
    void unknownGameReturns404() throws Exception {
        mockMvc.perform(get("/api/games/{id}", 999_999))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Game 999999 not found"));
    }

    @Test
    void goodGuessRevealsTheLetter() throws Exception {
        long id = startGame("Alice");
        char letter = wordOf(id).charAt(0);

        mockMvc.perform(post("/api/games/{id}/guesses", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"letter\": \"" + Character.toUpperCase(letter) + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.maskedWord").value(matchesPattern(Character.toUpperCase(letter) + ".*")))
                .andExpect(jsonPath("$.guessedLetters[0]").value(String.valueOf(letter)))
                .andExpect(jsonPath("$.remainingAttempts").value(6));
    }

    @Test
    void guessingTheSameWrongLetterTwiceCostsOnlyOneAttempt() throws Exception {
        long id = startGame("Alice");
        char wrong = (char) "abcdefghijklmnopqrstuvwxyz".chars()
                .filter(c -> wordOf(id).indexOf(c) < 0).findFirst().orElseThrow();

        guess(id, wrong);
        guess(id, wrong);

        mockMvc.perform(get("/api/games/{id}", id))
                .andExpect(jsonPath("$.wrongLetters", hasSize(1)))
                .andExpect(jsonPath("$.remainingAttempts").value(5));
    }

    @ParameterizedTest
    @ValueSource(strings = {"{\"letter\": \"ab\"}", "{\"letter\": \"1\"}", "{\"letter\": \"\"}", "{}"})
    void invalidGuessReturns400(String body) throws Exception {
        long id = startGame("Alice");

        mockMvc.perform(post("/api/games/{id}/guesses", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void wordIsRevealedWhenTheGameIsWon() throws Exception {
        long id = startGame("Alice");
        String word = wordOf(id);

        win(id);

        mockMvc.perform(get("/api/games/{id}", id))
                .andExpect(jsonPath("$.status").value("WON"))
                .andExpect(jsonPath("$.word").value(word))
                .andExpect(jsonPath("$.maskedWord").value(word.toUpperCase()))
                .andExpect(jsonPath("$.finishedAt").isNotEmpty());
    }

    @Test
    void guessingOnAFinishedGameReturns409() throws Exception {
        long id = startGame("Alice");
        lose(id);

        mockMvc.perform(post("/api/games/{id}/guesses", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"letter\": \"e\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void listsRecentGamesWithTheWordRevealed() throws Exception {
        startGame("Alice");
        long latest = startGame("Bob");

        mockMvc.perform(get("/api/games").param("limit", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(latest))
                .andExpect(jsonPath("$[0].word").value(wordOf(latest)));
    }

    @Test
    void invalidLimitReturns400() throws Exception {
        mockMvc.perform(get("/api/games").param("limit", "0"))
                .andExpect(status().isBadRequest());
    }
}
