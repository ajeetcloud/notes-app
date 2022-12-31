package com.notes.controller;

import com.notes.api.NotesApi;
import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class NotesController implements NotesApi {

    @Autowired
    NotesService notesService;

    @Override
    public List<Note> getAllNotes() {
        return notesService.getAllNotes();
    }

    @Override
    public Note createNote(Note note) {
        notesService.createNote(note);
        return note;
    }

    @Override
    public NotePage getPaginatedNotes(int pageNo, Optional<Integer> pageSize) {
        return notesService.getPaginatedNotes(pageNo, pageSize.orElseGet(() -> 20));
    }
}
