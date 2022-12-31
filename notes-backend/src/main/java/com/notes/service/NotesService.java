package com.notes.service;

import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
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

    public NotePage getPaginatedNotes(int pageNo, int pageSize) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();

        CriteriaQuery<Long> countQuery = criteriaBuilder
                .createQuery(Long.class);
        countQuery.select(criteriaBuilder
                .count(countQuery.from(Note.class)));
        Long count = session.createQuery(countQuery)
                .getSingleResult();

        CriteriaQuery<Note> criteriaQuery = criteriaBuilder
                .createQuery(Note.class);
        Root<Note> from = criteriaQuery.from(Note.class);
        CriteriaQuery<Note> select = criteriaQuery.select(from);
        TypedQuery<Note> typedQuery = session.createQuery(select);

        int startRowNum = ((int) (count - (pageNo * pageSize)));
        if (startRowNum < 0) {
            pageSize = startRowNum + pageSize;
            startRowNum = 0;
        }
        typedQuery.setFirstResult(startRowNum);
        typedQuery.setMaxResults(pageSize);
        List<Note> results = typedQuery.getResultList();
        session.getTransaction().commit();

        return getNotePage(results, startRowNum > 0 ? pageNo + 1 : -1, pageSize);
    }


    private NotePage getNotePage(List<Note> notes, int nextPage, int pageSize) {

        NotePage notePage = new NotePage();
        notePage.setNotes(notes);
        notePage.setNextPage(nextPage);
        notePage.setPageSize(pageSize);
        return notePage;
    }

    public List<Note> getAllNotes() {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Note> criteria = builder.createQuery(Note.class);
        Root<Note> root = criteria.from(Note.class);
        criteria.select(root);
        Query<Note> query = session.createQuery(criteria);
        List<Note> results = query.getResultList();
        session.getTransaction().commit();
        return results;
    }

    public void createNote(Note note) {
        long seconds = Instant.now().getEpochSecond();
        note.setUpdatedOn(seconds);
        note.setCreatedOn(seconds);
        HibernateUtil.save(note);
    }
}
