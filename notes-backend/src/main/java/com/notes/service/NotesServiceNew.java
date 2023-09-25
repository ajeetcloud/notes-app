package com.notes.service;

import com.notes.model.File;
import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.model.Notebook;
import com.notes.repository.FileRepository;
import com.notes.repository.NoteRepository;
import com.notes.util.HibernateUtil;
import com.notes.util.SortBy;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.hibernate.search.engine.search.query.SearchQuery;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class NotesServiceNew {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private NoteRepository noteRepository;

    @PersistenceContext
    EntityManager entityManager;

    /**
     * Retrieves a paginated list of notes for a given notebook ID.
     *
     * @param notebookId the ID of the notebook
     * @param pageNo     the page number of the results
     * @param pageSize   the number of notes per page
     * @return the NotePage object containing the paginated notes
     */
    public Page<?> getPaginatedNotes(String notebookId, int pageNo, int pageSize) {

        Specification<Note> spec = (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("notebookId"), notebookId);

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.Direction.DESC, "createdOn");
        Page<Note> notes = noteRepository.findAll(spec, pageable);

        return notes;
    }


    private NotePage getNotePage(List<Note> notes, int startRowNum, int currentPageNo, int pageSize) {

        NotePage notePage = new NotePage();
        notePage.setNotes(notes);
        notePage.setNextPage(startRowNum > 0 ? currentPageNo + 1 : 0);
        notePage.setPageSize(pageSize);
        return notePage;
    }

    public List<Note> getAllNotes() {
        List<Note> results = null;
        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            CriteriaBuilder builder = session.getCriteriaBuilder();
            CriteriaQuery<Note> criteria = builder.createQuery(Note.class);
            Root<Note> root = criteria.from(Note.class);
            criteria.select(root);
            Query<Note> query = session.createQuery(criteria);
            results = query.getResultList();
            session.getTransaction().commit();
        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            throw e;
        } finally {
            if (session.isOpen()) {
                session.close();
            }
        }
        return results;
    }


    public void createNote(Note note) {

        long currentTime = System.currentTimeMillis();
        note.setUpdatedOn(currentTime);
        note.setCreatedOn(currentTime);
        Notebook nb = new Notebook();
        nb.setNotebookId(note.getNotebookId());
        note.setNotebook(nb);
        for (File file : note.getFiles()) {
            file.setNote(note);
            file.setCreatedOn(currentTime);
        }
        noteRepository.save(note);
    }

    public void updateNote(Note note) {
        note.setUpdatedOn(System.currentTimeMillis());
        noteRepository.save(note);
    }


    @Transactional
    public void deleteNote(int noteId) {
        fileRepository.deleteFilesByNoteId(noteId);
        noteRepository.deleteNotesByNoteId(noteId);
    }


    @Transactional(readOnly = true)
    public Page<Note> getPaginatedSearchResults(String query, int pageNo, Integer pageSize, SortBy sortBy) {

        SearchSession searchSession = Search.session(entityManager);
        SearchQuery<Note> searchQuery;

        if (sortBy == SortBy.DATE) {
            searchQuery = searchSession.search(Note.class)
                    .where(f -> f.match().field("note").matching(query).fuzzy())
                    .sort(f -> f.field("created_on").desc())
                    .toQuery();
        } else {
            searchQuery = searchSession.search(Note.class)
                    .where(f -> f.match().field("note").matching(query).fuzzy())
                    .toQuery();
        }
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        SearchResult<Note> searchResult = searchQuery.fetch((int) pageable.getOffset(), pageable.getPageSize());
        return new PageImpl<>(searchResult.hits(), pageable, searchResult.total().hitCount());
    }

}
