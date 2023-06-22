package com.notes.controller;

import com.notes.api.NotebookApi;
import com.notes.model.NotePage;
import com.notes.model.Notebook;
import com.notes.service.NotebookService;
import com.notes.service.NotesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class NotebookController implements NotebookApi {

    @Autowired
    private NotebookService notebookService;

    @Autowired
    private NotesService notesService;

    @Override
    public List<Notebook> getAllNotebooks() {
        return notebookService.getAllNotebooks();
    }

    @Override
    public Notebook createNotebook(Notebook notebook) {
        notebookService.createNotebook(notebook);
        return notebook;
    }

    @Override
    public Notebook updateNotebook(Notebook notebook) {
        notebookService.updateNotebook(notebook);
        return notebook;
    }

    @Override
    public int deleteNotebook(int notebookId) {
        return notebookService.deleteNotebook(notebookId);
    }

    @Override
    public NotePage getPaginatedNotes(String notebookId, int pageNo, Optional<Integer> pageSize) {
        return notesService.getPaginatedNotes(notebookId, pageNo, pageSize.orElseGet(() -> 20));
    }

}
