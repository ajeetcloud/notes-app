package com.notes.controller;

import com.notes.model.Note;
import com.notes.service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotesController {

    @Autowired
    NotesService notesService;

    @GetMapping("/notes/all")
    public List<Note> getAllNotes() {
        return notesService.getAllNotes();
    }

    @PostMapping("/notes")
    public Note createNote(@RequestBody Note note) {
        notesService.createNote(note);
        return note;
    }

}
