package com.notes.service;

import com.notes.model.Note;
import com.notes.model.Notebook;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.Instant;
import java.util.List;

@Service
public class NotebookService {

    public List<Notebook> getAllNotebooks() {

        List<Notebook> results = null;
        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Notebook> criteriaQuery = cb.createQuery(Notebook.class);
            Root<Notebook> notebook = criteriaQuery.from(Notebook.class);
            criteriaQuery.multiselect(notebook.get("notebookId"), notebook.get("notebookName"), notebook.get("createdOn"));
            results = session.createQuery(criteriaQuery).getResultList();
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

    public void createNotebook(Notebook notebook) {

        long creationTime = System.currentTimeMillis();
        notebook.setUpdatedOn(creationTime);
        notebook.setCreatedOn(creationTime);
        HibernateUtil.save(notebook);
    }

    public void updateNotebook(Notebook notebook) {

        notebook.setUpdatedOn(Instant.now().getEpochSecond());
        HibernateUtil.update(notebook);
    }

    public void deleteNotebook(int notebookId) {
        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        int result = 0;
        try {
            tx = session.beginTransaction();
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();

            CriteriaDelete<Note> deleteNotes = criteriaBuilder.
                    createCriteriaDelete(Note.class);
            Root root = deleteNotes.from(Note.class);
            deleteNotes.where(criteriaBuilder.equal(root.get("notebookId"), notebookId));
            result = session.createQuery(deleteNotes).executeUpdate();

            CriteriaDelete<Notebook> delete = criteriaBuilder.
                    createCriteriaDelete(Notebook.class);
            Root e = delete.from(Notebook.class);
            delete.where(criteriaBuilder.equal(e.get("notebookId"), notebookId));
            result += session.createQuery(delete).executeUpdate();

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

}
