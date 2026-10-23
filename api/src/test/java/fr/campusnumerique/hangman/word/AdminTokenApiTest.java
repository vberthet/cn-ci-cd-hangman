package fr.campusnumerique.hangman.word;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.campusnumerique.hangman.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(properties = "app.admin-token=s3cret")
class AdminTokenApiTest extends IntegrationTest {

    private static final String NEW_WORD = "{\"value\": \"platypus\", \"category\": \"animals\"}";

    @Test
    void writesWithoutTheTokenAreRejected() throws Exception {
        mockMvc.perform(post("/api/words").contentType(MediaType.APPLICATION_JSON).content(NEW_WORD))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/api/words/{id}", 1))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void writesWithAWrongTokenAreRejected() throws Exception {
        mockMvc.perform(post("/api/words").header("X-Admin-Token", "guess")
                        .contentType(MediaType.APPLICATION_JSON).content(NEW_WORD))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void writesWithTheTokenAreAccepted() throws Exception {
        mockMvc.perform(post("/api/words").header("X-Admin-Token", "s3cret")
                        .contentType(MediaType.APPLICATION_JSON).content(NEW_WORD))
                .andExpect(status().isCreated());
    }

    @Test
    void readsDoNotNeedTheToken() throws Exception {
        mockMvc.perform(get("/api/words")).andExpect(status().isOk());
    }
}
