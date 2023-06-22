package com.notes.service;

import com.notes.exception.NoDataFoundException;
import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.model.Notebook;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.Instant;
import java.util.List;

@Service
public class NotesService {

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

    public void createNote(Note note) {
        long seconds = Instant.now().getEpochSecond();
        note.setUpdatedOn(seconds);
        note.setCreatedOn(seconds);
        Notebook nb = new Notebook();
        nb.setNotebookId(note.getNotebookId());
        note.setNotebook(nb);
        HibernateUtil.save(note);
    }
}
