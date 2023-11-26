package com.notes.controller;

import com.notes.api.NotesApi;
import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.service.NotesService;
import com.notes.service.NotesServiceNew;
import com.notes.util.SortBy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class NotesController implements NotesApi {

    @Autowired
    private NotesService notesService;

    @Autowired
    private NotesServiceNew notesServiceNew;

    @Override
    public List<Note> getAllNotes() {
        return notesService.getAllNotes();
    }

    @Override
    public Note createNote(Note note) {
        notesServiceNew.createNote(note);
        return note;
    }

    @Override
    public Note updateNote(Note note) {
        notesServiceNew.updateNote(note);
        return note;
    }

    @Override
    public void deleteNote(int noteId) {
        // notesService.deleteNote(noteId);
        notesServiceNew.deleteNote(noteId);
    }

    @Override
    public NotePage getSearchResults(String query, int pageNo, Optional<Integer> pageSize) {
        return notesService.getSearchResults(query, pageNo, pageSize.orElseGet(() -> 20));
    }

    @Override
    public Page<Note> getPaginatedSearchResults(String query, int pageNo, Optional<Integer> pageSize, Optional<SortBy> sortBy, int userId) {
        return notesServiceNew.getPaginatedSearchResults(query, pageNo, pageSize.orElseGet(() -> 20), sortBy.orElseGet(() -> SortBy.RELEVANCE), userId);
    }

}
