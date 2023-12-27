package com.notes.service;

import com.notes.model.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import com.notes.repository.FileRepository;
import com.notes.repository.NoteRepository;
import com.notes.util.HibernateUtil;
import com.notes.util.SortBy;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.hibernate.search.engine.search.query.SearchQuery;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;

@Service
public class NotesServiceNew {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private NoteRepository noteRepository;

    @PersistenceContext
    EntityManager entityManager;

    /**
     * Retrieves a paginated list of notes for a given notebook ID.
     *
     * @param notebookId the ID of the notebook
     * @param pageNo     the page number of the results
     * @param pageSize   the number of notes per page
     * @return the NotePage object containing the paginated notes
     */
    public Page<?> getPaginatedNotes(String notebookId, int pageNo, int pageSize) {

        Specification<Note> spec = (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("notebookId"), notebookId);

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.Direction.DESC, "createdOn");
        Page<Note> notes = noteRepository.findAll(spec, pageable);

        return notes;
    }


    private NotePage getNotePage(List<Note> notes, int startRowNum, int currentPageNo, int pageSize) {

        NotePage notePage = new NotePage();
        notePage.setNotes(notes);
        notePage.setNextPage(startRowNum > 0 ? currentPageNo + 1 : 0);
        notePage.setPageSize(pageSize);
        return notePage;
    }

    public List<Note> getAllNotes() {
        List<Note> results = null;
        Transaction tx = null;
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            tx = session.beginTransaction();
            CriteriaBuilder builder = session.getCriteriaBuilder();
            CriteriaQuery<Note> criteria = builder.createQuery(Note.class);
            Root<Note> root = criteria.from(Note.class);
            criteria.select(root);
            Query<Note> query = session.createQuery(criteria);
            results = query.getResultList();
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

    private List<String> getLinks(String content) {
        List<String> links = new ArrayList<>();
        Matcher matcher = HibernateUtil.pattern.matcher(content);
        while(matcher.find()) {
            links.add(matcher.group());
        }
        return links;
    }

    private Set<Link> getMetadata(List<String> links) {
        Set<Link> metadatas = new HashSet<>();
        for (String link: links) {
            Link metadata = new Link();
            try {
                Document document = Jsoup.connect(link)
                        .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.207.132.170 Safari/537.36")
                        .referrer("https://www.google.com")
                        .get();
                String title = document.title();
                String url = link;
                if (title.length() > 200) {
                    title = title.substring(0, 200);
                }
                if (url.length() > 200) {
                    url = url.substring(0, 200);
                }
                metadata.setUrl(url);
                metadata.setTitle(title);
                String description;
                Elements descriptionMetaTags = document.select("meta[name=description]");
                if (!descriptionMetaTags.isEmpty()) {
                    description = descriptionMetaTags.get(0).attr("content");
                    if (description.length() > 500) {
                        description = description.substring(0, 500);
                    }
                    metadata.setDescription(description);
                }
            } catch (IOException e) {
                System.out.println("Error: " + e.getMessage());
            }
            metadatas.add(metadata);
        }
        return metadatas;
    }

    public void createNote(Note note) {
        List<String> links = getLinks(note.getNote());
        Set<Link>metadatas = null;
        if (links.size() > 0) {
            metadatas = getMetadata(links);
        }

        long currentTime = System.currentTimeMillis();
        note.setUpdatedOn(currentTime);
        note.setCreatedOn(currentTime);
        Notebook nb = new Notebook();
        nb.setNotebookId(note.getNotebookId());
        note.setNotebook(nb);
        for (File file : note.getFiles()) {
            file.setNote(note);
            file.setCreatedOn(currentTime);
        }
        note.setLinks(metadatas);
        if (note.getLinks() != null) {
            for (Link link : note.getLinks()) {
                link.setNote(note);
                link.setCreatedOn(currentTime);
            }
        }
        noteRepository.save(note);
    }

    public void updateNote(Note note) {
        note.setUpdatedOn(System.currentTimeMillis());
        noteRepository.save(note);
    }


    @Transactional
    public void deleteNote(int noteId) {
        fileRepository.deleteFilesByNoteId(noteId);
        noteRepository.deleteNotesByNoteId(noteId);
    }


    @Transactional(readOnly = true)
    public Page<Note> getPaginatedSearchResults(String query, int pageNo, Integer pageSize, SortBy sortBy, int userId) {

        SearchSession searchSession = Search.session(entityManager);
        SearchQuery<Note> searchQuery;

        if (sortBy == SortBy.NEWEST) {
            searchQuery = searchSession.search(Note.class)
                    .where(f -> f.bool()
                            .must(f1 -> f1.match().field("note").matching(query).fuzzy())
                            .must(f1 -> f1.match().field("user_id").matching(userId))
                    )
                    .sort(f -> f.field("created_on").desc())
                    .toQuery();
        } else if (sortBy == SortBy.OLDEST) {
            searchQuery = searchSession.search(Note.class)
                    .where(f -> f.bool()
                            .must(f1 -> f1.match().field("note").matching(query).fuzzy())
                            .must(f1 -> f1.match().field("user_id").matching(userId))
                    )
                    .sort(f -> f.field("created_on"))
                    .toQuery();
        } else {
            searchQuery = searchSession.search(Note.class)
                    .where(f -> f.bool()
                            .must(f1 -> f1.match().field("note").matching(query).fuzzy())
                            .must(f1 -> f1.match().field("user_id").matching(userId))
                    )
                    .toQuery();
        }
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        SearchResult<Note> searchResult = searchQuery.fetch((int) pageable.getOffset(), pageable.getPageSize());
        return new PageImpl<>(searchResult.hits(), pageable, searchResult.total().hitCount());
    }

}
