package fr.campusnumerique.hangman.word;

import fr.campusnumerique.hangman.error.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Protects dictionary writes when ADMIN_TOKEN is set. When it is empty, everyone is allowed. */
@Component
public class AdminTokenGuard {

    public static final String HEADER = "X-Admin-Token";

    private final String adminToken;

    public AdminTokenGuard(@Value("${app.admin-token:}") String adminToken) {
        this.adminToken = adminToken;
    }

    public void check(String providedToken) {
        if (!adminToken.isEmpty() && !adminToken.equals(providedToken)) {
            throw new UnauthorizedException("Missing or invalid " + HEADER + " header");
        }
    }
}
