package com.notes.controller;

import com.notes.api.NotesApi;
import com.notes.model.Note;
import com.notes.service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
    public List<Note> getPaginatedNotes() {
        return notesService.getPaginatedNotes();
    }

}
