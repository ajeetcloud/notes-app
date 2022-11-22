package com.notes.api;

import com.notes.model.Note;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface NotesApi {

    @GetMapping("/notes/all")
    List<Note> getAllNotes();

    @PostMapping("/notes")
    Note createNote(@RequestBody Note note);
}
