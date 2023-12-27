package com.notes.util;

import com.notes.model.Note;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import java.util.regex.Pattern;

public class HibernateUtil<T> {

    public static String urlPattern = "(?i)\\b(?:https?):\\/\\/\\S+(?:\\b|$)";
    public static Pattern pattern = Pattern.compile(urlPattern);
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

    public static <T> void delete(T t) {
        Transaction tx = null;
        Session session = getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            session.delete(t);
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
