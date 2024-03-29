package com.notes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "files")
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private int fileId;

    @Column(name = "note_id", insertable = false, updatable = false)
    private int noteId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "drive_id")
    private String driveId;

    @Column(name = "created_on", updatable = false)
    private long createdOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id", updatable = false)
    @JsonIgnore
    private Note note;

    public int getFileId() {
        return fileId;
    }

    public void setFileId(int fileId) {
        this.fileId = fileId;
    }

    public int getNoteId() {
        return noteId;
    }

    public void setNoteId(int noteId) {
        this.noteId = noteId;
    }

    public String getDriveId() {
        return driveId;
    }

    public void setDriveId(String driveId) {
        this.driveId = driveId;
    }

    public long getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(long createdOn) {
        this.createdOn = createdOn;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj == null || obj.getClass() != this.getClass()) {
            return false;
        }
        File other = (File) obj;
        return Objects.equals(driveId, other.driveId);
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        return prime * fileId;
    }
}
