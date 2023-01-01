package com.notes.model;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "notebooks")
public class Notebook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notebook_id")
    private int notebookId;

    @Column(name = "notebook_name")
    private String notebookName;

    @Column(name = "updated_on")
    private long updatedOn;

    @Column(name = "created_on")
    private long createdOn;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "notebook", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Note> notes;

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
}
