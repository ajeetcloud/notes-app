package com.notes.service;

import com.notes.model.Notebook;
import com.notes.repository.FileRepository;
import com.notes.repository.NoteRepository;
import com.notes.repository.NotebookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Service
public class NotebookServiceNew {

    @Autowired
    private NotebookRepository notebookRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private FileRepository fileRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Retrieves all notebooks from the database.
     *
     * @return List of notebooks containing notebookId, notebookName, and createdOn
     */
    public List<Notebook> getAllNotebooks() {

        return notebookRepository.findAll();
    }

    public List<Notebook> getAllNotebooksForUserId(int userId) {

        return notebookRepository.findAllByUserId(userId);
    }


    /**
     * Creates a new notebook.
     *
     * @param notebook the notebook object to be created
     */
    @Transactional
    public void createNotebook(Notebook notebook) {

        long currentTime = System.currentTimeMillis();
        notebook.setUpdatedOn(currentTime);
        notebook.setCreatedOn(currentTime);
        notebookRepository.save(notebook);
    }

    /**
     * Updates the given notebook by setting the updated timestamp and updating it in the database.
     *
     * @param notebook the notebook to be updated
     */
    @Transactional
    public Notebook updateNotebook(Notebook notebook) {

        notebook.setUpdatedOn(System.currentTimeMillis());
        // notebookRepository.updateNotebookByNotebookId(notebook.getNotebookId(), notebook.getNotebookName(), notebook.getUpdatedOn());
        return notebookRepository.save(notebook);
    }

    /**
     * Deletes a notebook and all associated notes from the database.
     *
     * @param notebookId the ID of the notebook to be deleted
     */
    @Transactional
    public void deleteNotebook(int notebookId) {

        fileRepository.deleteFilesByNotebookIdWithJoins(notebookId);
        noteRepository.deleteNotesByNotebookId(notebookId);
        notebookRepository.deleteNotebookByNotebookId(notebookId);
    }

}
