package com.notes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;


@Entity
@Table(name = "my_notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private int noteId;

    @Column(name = "notebook_id", insertable = false, updatable = false)
    private int notebookId;

    @Column(name = "note")
    private String note;

    @Column(name = "updated_on")
    private long updatedOn;

    @Column(name = "created_on", updatable = false)
    private long createdOn;

    @ManyToOne
    @JoinColumn(name = "notebook_id", updatable = false)
    @JsonIgnore
    private Notebook notebook;

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
}
