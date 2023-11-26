package com.notes.api;

import com.notes.model.NotePage;
import com.notes.model.Notebook;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/notebooks")
public interface NotebookApi {

    @GetMapping("/")
    List<Notebook> getAllNotebooks();

    @GetMapping("/user/{userId}")
    List<Notebook> getAllNotebooksForUserId(@PathVariable int userId);

    @PostMapping("/")
    Notebook createNotebook(@RequestBody Notebook notebook);

    @PutMapping("/")
    Notebook updateNotebook(@RequestBody Notebook notebook);

    @DeleteMapping("/{notebookId}")
    void deleteNotebook(@PathVariable int notebookId);

    @GetMapping("/{notebookId}/notes")
    NotePage getPaginatedNotes(@PathVariable String notebookId, @RequestParam int pageNo, @RequestParam Optional<Integer> pageSize);

    @GetMapping("/{notebookId}/notes1")
    Page<?> getPaginatedNotes1(@PathVariable String notebookId, @RequestParam int pageNo, @RequestParam Optional<Integer> pageSize);
}
