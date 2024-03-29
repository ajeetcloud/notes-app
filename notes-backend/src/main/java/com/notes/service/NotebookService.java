package com.notes.service;

import com.notes.model.Note;
import com.notes.model.Notebook;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class NotebookService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Retrieves all notebooks from the database.
     *
     * @return List of notebooks containing notebookId, notebookName, and createdOn
     */
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
        entityManager.persist(notebook);
        // HibernateUtil.save(notebook);
    }

    /**
     * Updates the given notebook by setting the updated timestamp and updating it in the database.
     *
     * @param notebook the notebook to be updated
     */
    @Transactional
    public void updateNotebook(Notebook notebook) {

        notebook.setUpdatedOn(System.currentTimeMillis());
        entityManager.merge(notebook);
        // HibernateUtil.update(notebook);
    }

    /**
     * Deletes a notebook and all associated notes from the database.
     *
     * @param notebookId the ID of the notebook to be deleted
     */
    public void deleteNotebook(int notebookId) {
        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        int result = 0;
        try {
            tx = session.beginTransaction();
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();

            String hqlSubquery = "SELECT n.noteId FROM Note n WHERE n.notebookId = :notebookId";
            String hqlDelete = "DELETE FROM File f WHERE f.noteId IN (" + hqlSubquery + ")";
            Query query = session.createQuery(hqlDelete);
            query.setParameter("notebookId", notebookId);

            result = query.executeUpdate();


            CriteriaDelete<Note> deleteNotes = criteriaBuilder.
                    createCriteriaDelete(Note.class);
            Root root = deleteNotes.from(Note.class);
            deleteNotes.where(criteriaBuilder.equal(root.get("notebookId"), notebookId));
            result += session.createQuery(deleteNotes).executeUpdate();

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
