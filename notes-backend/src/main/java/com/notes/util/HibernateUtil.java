package com.notes.util;

import com.notes.model.Note;
import com.notes.model.Notebook;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

public class HibernateUtil<T> {
    private static final SessionFactory sessionFactory = buildSessionFactory();

    private static SessionFactory buildSessionFactory() {
        return new Configuration().configure("hibernate.cfg.xml").buildSessionFactory();
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public static void shutdown() {
        // Close caches and connection pools
        getSessionFactory().close();
    }

    public static <T> void save(T t) {
        Transaction tx = null;
        Session session = getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            session.save(t);
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
    }

    public static <T> void update(T t) {
        Transaction tx = null;
        Session session = getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            session.update(t);
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
    }

    public static void deleteNotebook(int notebookId) {
        Transaction tx = null;
        Session session = getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            Notebook notebook = session.get(Notebook.class, notebookId);
            if (notebook != null) {
                session.delete(notebook);
            }
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
    }

    public static void deleteNote(int noteId) {
        Transaction tx = null;
        Session session = getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            Note note = session.get(Note.class, noteId);
            if (note != null) {
                session.delete(note);
            }
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
    }


}
