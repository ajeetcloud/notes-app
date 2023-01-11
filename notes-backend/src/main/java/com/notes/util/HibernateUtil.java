package com.notes.util;

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
        try (Session session = getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.save(t);
            session.getTransaction().commit();
        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            throw e;
        }
    }

    public static <T> void update(T t) {
        Transaction tx = null;
        try (Session session = getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.update(t);
            session.getTransaction().commit();
        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            throw e;
        }
    }
}
