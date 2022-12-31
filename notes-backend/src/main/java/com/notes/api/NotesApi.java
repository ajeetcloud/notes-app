package com.notes.api;

import com.notes.model.Note;
import com.notes.model.NotePage;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/notes")
public interface NotesApi {

    @GetMapping("/")
    List<Note> getAllNotes();

    @PostMapping("/")
    Note createNote(@RequestBody Note note);

    @GetMapping("/pages")
    NotePage getPaginatedNotes(@RequestParam int pageNo, @RequestParam Optional<Integer> pageSize);
}
