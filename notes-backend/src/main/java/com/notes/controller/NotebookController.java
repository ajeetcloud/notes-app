package com.notes.controller;

import com.notes.api.NotebookApi;
import com.notes.model.Notebook;
import com.notes.service.NotebookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotebookController implements NotebookApi {

    @Autowired
    private NotebookService notebookService;

    @Override
    public List<Object[]> getAllNotebooks() {
        return notebookService.getAllNotebooks();
    }

    @Override
    public Notebook createNotebook(Notebook notebook) {
        return null;
    }
}
