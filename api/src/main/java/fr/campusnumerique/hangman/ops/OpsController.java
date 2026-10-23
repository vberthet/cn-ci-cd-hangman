package fr.campusnumerique.hangman.ops;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class OpsController {

    private final InfoView info;

    public OpsController(@Value("${app.version}") String version,
                         @Value("${app.environment}") String environment) {
        this.info = new InfoView(version, environment);
    }

    /** Which version runs where: displayed in the footer of the front-end apps. */
    @GetMapping("/info")
    public InfoView info() {
        return info;
    }

    /** Fails on purpose, to check that errors reach Sentry. */
    @GetMapping("/debug/error")
    public void error() {
        throw new IllegalStateException("Test error for Sentry");
    }
}
