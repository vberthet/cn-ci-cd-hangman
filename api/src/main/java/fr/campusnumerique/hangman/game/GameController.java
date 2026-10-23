package fr.campusnumerique.hangman.game;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GameView start(@RequestBody(required = false) @Valid CreateGameRequest request,
                          @RequestParam(required = false) String category) {
        String playerName = request == null ? null : request.playerName();
        return gameService.start(playerName, category);
    }

    @GetMapping("/{id}")
    public GameView get(@PathVariable long id) {
        return gameService.get(id);
    }

    @PostMapping("/{id}/guesses")
    public GameView guess(@PathVariable long id, @RequestBody @Valid GuessRequest request) {
        return gameService.guess(id, request.letter().charAt(0));
    }

    @GetMapping
    public List<GameView> recent(@RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit) {
        return gameService.recent(limit);
    }
}
