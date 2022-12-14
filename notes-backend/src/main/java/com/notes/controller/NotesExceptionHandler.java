package com.notes.controller;

import com.notes.exception.NoDataFoundException;
import com.notes.model.ExceptionResponse;
import com.notes.util.HibernateUtil;
import org.hibernate.Session;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class NotesExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NoDataFoundException.class)
    public ResponseEntity<ExceptionResponse> handleException(RuntimeException ex, WebRequest request) {
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        if (session.getTransaction().isActive()) {
            session.getTransaction().rollback();
        }
        ExceptionResponse exceptionResponse = new ExceptionResponse(ex.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<>(exceptionResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ExceptionResponse> handleAllExceptions(Exception exception, WebRequest request) {

        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        if (session.getTransaction().isActive()) {
            session.getTransaction().commit();
        }
        ExceptionResponse exceptionResponse = new ExceptionResponse(exception.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
