package com.notes.repository;

import com.notes.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoteRepository extends JpaRepository<Note, Integer>, JpaSpecificationExecutor<Note> {

    @Modifying
    @Query("DELETE FROM Note note WHERE note.noteId = :noteId")
    void deleteNotesByNoteId(@Param("noteId") int noteId);

    @Modifying
    @Query("DELETE FROM Note note WHERE note.notebookId = :notebookId")
    void deleteNotesByNotebookId(@Param("notebookId") int notebookId);

}
