package fr.campusnumerique.hangman.word;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import fr.campusnumerique.hangman.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.MediaType;

class WordApiTest extends IntegrationTest {

    @Test
    void listsTheSeededDictionary() throws Exception {
        mockMvc.perform(get("/api/words"))
                .andExpect(status().isOk())
                // At least the seeded words: adding words in a new migration must not break this test
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(150))))
                .andExpect(jsonPath("$[*].value", hasItems("algorithm", "giraffe")))
                .andExpect(jsonPath("$[*].timesPlayed", everyItem(is(0))))
                .andExpect(jsonPath("$[*].timesWon", everyItem(is(0))));
    }

    @Test
    void filtersByCategoryAndSearch() throws Exception {
        mockMvc.perform(get("/api/words").param("category", "animals").param("search", "GIR"))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].value").value("giraffe"))
                .andExpect(jsonPath("$[0].category").value("animals"));

        mockMvc.perform(get("/api/words").param("category", "food").param("search", ""))
                .andExpect(jsonPath("$", hasSize(25)))
                .andExpect(jsonPath("$[*].category", everyItem(is("food"))));
    }

    @Test
    void countsGamesPlayedAndWonPerWord() throws Exception {
        long id = startGame("Alice");
        win(id);
        startGame("Bob");

        mockMvc.perform(get("/api/words").param("search", wordOf(id)))
                .andExpect(jsonPath("$[?(@.value == '" + wordOf(id) + "')].timesWon").value(1));
    }

    @Test
    void listsCategories() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0]").value("animals"));
    }

    @Test
    void createsAWordInLowercase() throws Exception {
        mockMvc.perform(post("/api/words")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"Platypus\", \"category\": \"Animals\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.value").value("platypus"))
                .andExpect(jsonPath("$.category").value("animals"))
                .andExpect(jsonPath("$.timesPlayed").value(0));
    }

    @ParameterizedTest
    @ValueSource(strings = {"ox", "rock and roll", "r2d2", "abcdefghijklmnopqrstuvwxyzabcde"})
    void rejectsInvalidWords(String value) throws Exception {
        mockMvc.perform(post("/api/words")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"" + value + "\", \"category\": \"misc\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rejectsDuplicates() throws Exception {
        mockMvc.perform(post("/api/words")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"GIRAFFE\", \"category\": \"animals\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void deletesAWord() throws Exception {
        String json = mockMvc.perform(post("/api/words")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"value\": \"platypus\", \"category\": \"animals\"}"))
                .andReturn().getResponse().getContentAsString();
        long id = ((Number) JsonPath.read(json, "$.id")).longValue();

        mockMvc.perform(delete("/api/words/{id}", id)).andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/words/{id}", id)).andExpect(status().isNotFound());
    }

    @Test
    void cannotDeleteAWordThatWasPlayed() throws Exception {
        long gameId = startGame("Alice");
        long wordId = gameRepository.findById(gameId).orElseThrow().getWord().getId();

        mockMvc.perform(delete("/api/words/{id}", wordId)).andExpect(status().isConflict());
    }
}
