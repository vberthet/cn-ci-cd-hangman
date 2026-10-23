package fr.campusnumerique.hangman.ops;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.campusnumerique.hangman.IntegrationTest;
import org.junit.jupiter.api.Test;

class OpsApiTest extends IntegrationTest {

    @Test
    void exposesVersionAndEnvironment() throws Exception {
        mockMvc.perform(get("/api/info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.version").value("dev"))
                .andExpect(jsonPath("$.environment").value("development"));
    }

    @Test
    void healthIsUp() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void debugEndpointFailsOnPurpose() {
        // MockMvc has no servlet container: the unhandled exception (a 500 in real life) is rethrown here.
        assertThatThrownBy(() -> mockMvc.perform(get("/api/debug/error")))
                .hasRootCauseInstanceOf(IllegalStateException.class)
                .hasRootCauseMessage("Test error for Sentry");
    }
}
