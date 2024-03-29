package com.notes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "notebooks")
public class Notebook {

    public Notebook() {
    }

    public Notebook(int notebookId, String notebookName, long createdOn) {
        this.notebookId = notebookId;
        this.notebookName = notebookName;
        this.createdOn = createdOn;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notebook_id")
    private int notebookId;

    @Column(name = "notebook_name")
    private String notebookName;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "updated_on")
    @JsonIgnore
    private long updatedOn;

    @Column(name = "created_on", updatable = false)
    private long createdOn;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "notebook")
    @JsonIgnore
    private Set<Note> notes;

    public int getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(int notebookId) {
        this.notebookId = notebookId;
    }

    public String getNotebookName() {
        return notebookName;
    }

    public void setNotebookName(String notebookName) {
        this.notebookName = notebookName;
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

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Set<Note> getNotes() {
        return notes;
    }

    public void setNotes(Set<Note> notes) {
        this.notes = notes;
    }
}
