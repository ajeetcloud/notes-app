package com.notes.service;

import com.notes.model.Notebook;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class NotebookService {

    public List<Object[]> getAllNotebooks() {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        CriteriaBuilder builder = session.getCriteriaBuilder();

        CriteriaQuery<Object[]> criteria = builder.createQuery(Object[].class);
        Root<Notebook> root = criteria.from(Notebook.class);

        criteria.multiselect(root.get("notebookId"), root.get("notebookName"), root.get("createdOn"));
        Query<Object[]> query = session.createQuery(criteria);
        List<Object[]> results = query.getResultList();
        session.getTransaction().commit();
        return results;
    }

}
