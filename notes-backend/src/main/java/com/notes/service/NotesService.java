package com.notes.service;

import com.notes.exception.NoDataFoundException;
import com.notes.model.File;
import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.model.Notebook;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.hibernate.search.engine.search.query.SearchQuery;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class NotesService {

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
    public NotePage getPaginatedNotes(String notebookId, int pageNo, int pageSize) {
        int origPageSize = pageSize;
        List<Note> results = null;
        int startRowNum = 0;
        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();

            CriteriaQuery<Long> cr = criteriaBuilder.createQuery(Long.class);
            Root<Note> root = cr.from(Note.class);
            cr.select(criteriaBuilder.count(root)).where(criteriaBuilder.equal(root.get("notebookId"), notebookId));
            Long query = session.createQuery(cr).getSingleResult();
            System.out.println(query);

            Long count = query;

            startRowNum = ((int) (count - (pageNo * pageSize)));
            if (startRowNum < 0) {
                pageSize = startRowNum + pageSize;
                startRowNum = 0;
            }
            if (pageSize < 0) {
                throw new NoDataFoundException(String.format(
                        "No data found for pageNo:%d with pageSize:%d", pageNo, origPageSize));
            }
            CriteriaQuery<Note> criteriaQuery = criteriaBuilder
                    .createQuery(Note.class);
            Root<Note> from = criteriaQuery.from(Note.class);
            CriteriaQuery<Note> select = criteriaQuery
                    .select(from)
                    .where(criteriaBuilder.equal(from.get("notebookId"), notebookId));

            TypedQuery<Note> typedQuery = session.createQuery(select);
            typedQuery.setFirstResult(startRowNum);
            typedQuery.setMaxResults(pageSize);
            results = typedQuery.getResultList();
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
        return getNotePage(results, startRowNum, pageNo, pageSize);
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

    @Transactional
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

        entityManager.persist(note);

/*        SearchSession searchSession = Search.session(entityManager);
        SearchIndexingPlan indexingPlan = searchSession.indexingPlan();
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
        HibernateUtil.save(note);
        indexingPlan.execute();*/
    }

    public void updateNote(Note note) {

        note.setUpdatedOn(System.currentTimeMillis());
        HibernateUtil.update(note);
    }

    public void deleteNote(int noteId) {
/*        Note note = new Note();
        note.setNoteId(noteId);
        HibernateUtil.delete(note);*/


        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        int result = 0;
        try {
            tx = session.beginTransaction();
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();

            CriteriaDelete<File> deleteFiles = criteriaBuilder.createCriteriaDelete(File.class);
            Root root = deleteFiles.from(File.class);
            deleteFiles.where(criteriaBuilder.equal(root.get("noteId"), noteId));
            result = session.createQuery(deleteFiles).executeUpdate();

            CriteriaDelete<Note> deleteNotes = criteriaBuilder.createCriteriaDelete(Note.class);
            Root rootNote = deleteNotes.from(Note.class);
            deleteNotes.where(criteriaBuilder.equal(rootNote.get("noteId"), noteId));
            result += session.createQuery(deleteNotes).executeUpdate();

            session.getTransaction().commit();
            System.out.println(result + "row(s) affected");
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
    }

    @Transactional
    public NotePage getSearchResults(String query, int pageNo, Integer pageSize) {
        int origPageSize = pageSize;
        List<Note> results = null;
        int startRowNum = 0;
        Transaction tx = null;
        try {
            CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

            CriteriaQuery<Long> cr = criteriaBuilder.createQuery(Long.class);
            Root<Note> root = cr.from(Note.class);
            cr.select(criteriaBuilder.count(root)).where(criteriaBuilder.like(root.get("note"), "%" + query + "%"));

            Long countQuery = entityManager.createQuery(cr).getSingleResult();
            System.out.println(query);

            Long count = countQuery;

            startRowNum = ((int) (count - (pageNo * pageSize)));
            if (startRowNum < 0) {
                pageSize = startRowNum + pageSize;
                startRowNum = 0;
            }
            if (pageSize < 0) {
                throw new NoDataFoundException(String.format(
                        "No data found for pageNo:%d with pageSize:%d", pageNo, origPageSize));
            }
            CriteriaQuery<Note> criteriaQuery = criteriaBuilder
                    .createQuery(Note.class);
            Root<Note> from = criteriaQuery.from(Note.class);
            CriteriaQuery<Note> select = criteriaQuery
                    .select(from)
                    .where(criteriaBuilder.like(from.get("note"), "%" + query + "%"));

            TypedQuery<Note> typedQuery = entityManager.createQuery(select);
            typedQuery.setFirstResult(startRowNum);
            typedQuery.setMaxResults(pageSize);
            results = typedQuery.getResultList();


        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            throw e;
        }

        return getNotePage(results, startRowNum, pageNo, pageSize);
    }

    @Transactional(readOnly = true)
    public List<Note> start() {
        try {

/*
            Session session = HibernateUtil.getSessionFactory().openSession();
            SearchSession searchSession = Search.session(session);


            MassIndexer indexer = searchSession.massIndexer(Note.class);
            indexer.startAndWait();*/

            SearchSession searchSession = Search.session(entityManager);
            SearchQuery<Note> query = searchSession.search(Note.class)
                    .where(f -> f.match().field("note").matching("peach").fuzzy())
                    .toQuery();

            List<Note> results = query.fetchAllHits();
            System.out.println(results);
            System.out.println(results.size());
            return results;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
        return null;
    }
}
