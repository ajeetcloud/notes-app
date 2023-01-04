package com.notes.service;

import com.notes.model.Notebook;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.Instant;
import java.util.List;

@Service
public class NotebookService {

    public List<Notebook> getAllNotebooks() {

        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<Notebook> criteriaQuery = cb.createQuery(Notebook.class);
        Root<Notebook> notebook = criteriaQuery.from(Notebook.class);
        criteriaQuery.multiselect(notebook.get("notebookId"), notebook.get("notebookName"), notebook.get("createdOn"));
        List<Notebook> results = session.createQuery(criteriaQuery).getResultList();
        session.getTransaction().commit();
        return results;
    }

    public void createNotebook(Notebook notebook) {

        long seconds = Instant.now().getEpochSecond();
        notebook.setUpdatedOn(seconds);
        notebook.setCreatedOn(seconds);
        HibernateUtil.save(notebook);
    }

}
