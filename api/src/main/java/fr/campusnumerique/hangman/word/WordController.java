package fr.campusnumerique.hangman.word;

import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class WordController {

    private final WordService wordService;
    private final AdminTokenGuard adminTokenGuard;

    public WordController(WordService wordService, AdminTokenGuard adminTokenGuard) {
        this.wordService = wordService;
        this.adminTokenGuard = adminTokenGuard;
    }

    @GetMapping("/words")
    public List<WordView> search(@RequestParam(required = false) String search,
                                 @RequestParam(required = false) String category) {
        return wordService.search(search, category);
    }

    @PostMapping("/words")
    @ResponseStatus(HttpStatus.CREATED)
    public WordView create(@RequestHeader(value = AdminTokenGuard.HEADER, required = false) String token,
                           @RequestBody @Valid CreateWordRequest request) {
        adminTokenGuard.check(token);
        return wordService.create(request.value(), request.category());
    }

    @DeleteMapping("/words/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestHeader(value = AdminTokenGuard.HEADER, required = false) String token,
                       @PathVariable long id) {
        adminTokenGuard.check(token);
        wordService.delete(id);
    }

    @GetMapping("/categories")
    public List<String> categories() {
        return wordService.categories();
    }
}
