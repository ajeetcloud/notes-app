package com.notes.controller;

import com.notes.model.Notes;
import com.notes.service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotesController {

    @Autowired
    NotesService notesService;

    @GetMapping("/notes/all")
    public List<Notes> getAllNotes() {
        return notesService.getAllNotes();
    }

}
