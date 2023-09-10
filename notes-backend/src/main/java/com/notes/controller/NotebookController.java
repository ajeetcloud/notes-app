package com.notes.controller;

import com.notes.api.NotebookApi;
import com.notes.model.NotePage;
import com.notes.model.Notebook;
import com.notes.service.NotebookService;
import com.notes.service.NotebookServiceNew;
import com.notes.service.NotesService;
import com.notes.service.NotesServiceNew;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class NotebookController implements NotebookApi {

    @Autowired
    private NotebookService notebookService;

    @Autowired
    private NotebookServiceNew notebookServiceNew;

    @Autowired
    private NotesService notesService;

    @Autowired
    private NotesServiceNew notesServiceNew;

    @Override
    public List<Notebook> getAllNotebooks() {
        return notebookServiceNew.getAllNotebooks();
    }

    @Override
    public Notebook createNotebook(Notebook notebook) {
        notebookServiceNew.createNotebook(notebook);
        return notebook;
    }

    @Override
    public Notebook updateNotebook(Notebook notebook) {
        return notebookServiceNew.updateNotebook(notebook);
    }

    @Override
    public void deleteNotebook(int notebookId) {
        notebookServiceNew.deleteNotebook(notebookId);
    }

    @Override
    public NotePage getPaginatedNotes(String notebookId, int pageNo, Optional<Integer> pageSize) {
        return notesService.getPaginatedNotes(notebookId, pageNo, pageSize.orElseGet(() -> 20));
    }

    @Override
    public Page<?> getPaginatedNotes1(String notebookId, int pageNo, Optional<Integer> pageSize) {
        return notesServiceNew.getPaginatedNotes(notebookId, pageNo, pageSize.orElseGet(() -> 20));
    }

}
