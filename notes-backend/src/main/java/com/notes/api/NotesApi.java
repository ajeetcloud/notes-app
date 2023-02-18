package com.notes.api;

import com.notes.model.Note;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/notes")
public interface NotesApi {

    @GetMapping("/")
    List<Note> getAllNotes();

    @PostMapping("/")
    Note createNote(@RequestBody Note note);
}
