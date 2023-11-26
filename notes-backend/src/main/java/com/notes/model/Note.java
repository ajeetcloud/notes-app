package com.notes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

import javax.persistence.*;
import java.util.Set;


@Entity
@Indexed
@Table(name = "my_notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private int noteId;

    @Column(name = "notebook_id", insertable = false, updatable = false)
    private int notebookId;

    @FullTextField(name = "note")
    @Column(name = "note")
    private String note;

    @GenericField(name = "user_id")
    @Column(name = "user_id")
    private int userId;

    @Column(name = "updated_on")
    private long updatedOn;

    @GenericField(name = "created_on", sortable = Sortable.YES)
    @Column(name = "created_on", updatable = false)
    private long createdOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notebook_id", updatable = false)
    @JsonIgnore
    private Notebook notebook;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "note", cascade = CascadeType.ALL)
    private Set<File> files;

    public int getNoteId() {
        return noteId;
    }

    public void setNoteId(int noteId) {
        this.noteId = noteId;
    }

    public Notebook getNotebook() {
        return notebook;
    }

    public void setNotebook(Notebook notebook) {
        this.notebook = notebook;
    }

    public int getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(int notebookId) {
        this.notebookId = notebookId;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public long getUpdatedOn() {
        return updatedOn;
    }

    public void setUpdatedOn(long updatedOn) {
        this.updatedOn = updatedOn;
    }

    public long getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(long createdOn) {
        this.createdOn = createdOn;
    }

    public Set<File> getFiles() {
        return files;
    }

    public void setFiles(Set<File> files) {
        this.files = files;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null || obj.getClass() != this.getClass()) {
            return false;
        }
        Note other = (Note) obj;
        return noteId == other.noteId;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        return prime * noteId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
