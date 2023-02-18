package com.notes.api;

import com.notes.model.NotePage;
import com.notes.model.Notebook;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/notebooks")
public interface NotebookApi {

    @GetMapping("/")
    List<Notebook> getAllNotebooks();

    @PostMapping("/")
    Notebook createNotebook(@RequestBody Notebook notebook);

    @GetMapping("/{notebookId}/notes")
    NotePage getPaginatedNotes(@PathVariable String notebookId, @RequestParam int pageNo, @RequestParam Optional<Integer> pageSize);
}
