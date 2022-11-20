package com.notes.service;

import com.notes.model.Notes;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

@Service
public class NotesService {

    public List<Notes> getAllNotes() {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Notes> criteria = builder.createQuery(Notes.class);
        Root<Notes> root = criteria.from(Notes.class);
        criteria.select(root);
        Query<Notes> query = session.createQuery(criteria);
        List<Notes> results = query.getResultList();
        session.getTransaction().commit();
        return results;
    }
}
