package fr.campusnumerique.hangman.stats;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.campusnumerique.hangman.IntegrationTest;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class StatsApiTest extends IntegrationTest {

    @Test
    void emptyStatsWhenNoGameWasPlayed() throws Exception {
        mockMvc.perform(get("/api/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalGames").value(0))
                .andExpect(jsonPath("$.winRate").value(0.0))
                .andExpect(jsonPath("$.gamesPerDay", hasSize(14)))
                .andExpect(jsonPath("$.gamesPerDay[13].games").value(0))
                .andExpect(jsonPath("$.hardestWords", hasSize(0)))
                .andExpect(jsonPath("$.topPlayers", hasSize(0)));
    }

    @Test
    void aggregatesPlayedGames() throws Exception {
        win(startGame("Alice"));
        win(startGame("Alice"));
        win(startGame("Bob"));
        long lostGame = startGame("Bob");
        lose(lostGame);
        startGame("Carol");

        mockMvc.perform(get("/api/stats"))
                .andExpect(jsonPath("$.totalGames").value(5))
                .andExpect(jsonPath("$.won").value(3))
                .andExpect(jsonPath("$.lost").value(1))
                .andExpect(jsonPath("$.inProgress").value(1))
                .andExpect(jsonPath("$.winRate").value(0.75))
                .andExpect(jsonPath("$.averageWrongGuesses").value(1.5))
                .andExpect(jsonPath("$.gamesPerDay[13].date").value(LocalDate.now().toString()))
                .andExpect(jsonPath("$.gamesPerDay[13].games").value(5))
                .andExpect(jsonPath("$.gamesPerDay[13].won").value(3))
                .andExpect(jsonPath("$.hardestWords[0].word").value(wordOf(lostGame)))
                .andExpect(jsonPath("$.hardestWords[0].winRate").value(0.0))
                .andExpect(jsonPath("$.topPlayers[0].playerName").value("Alice"))
                .andExpect(jsonPath("$.topPlayers[0].won").value(2))
                .andExpect(jsonPath("$.topPlayers", hasSize(2)));
    }
}
