package com.notes.repository;

import com.notes.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FileRepository extends JpaRepository<File, Integer> {

    @Modifying
    @Query("DELETE FROM File f WHERE f.fileId = :fileId")
    void deleteFilesByFileId(@Param("fileId") int fileId);


    @Modifying
    @Query("DELETE FROM File f WHERE f.noteId = :noteId")
    void deleteFilesByNoteId(@Param("noteId") int noteId);


    @Modifying
    @Query(nativeQuery = true, value = "DELETE f FROM files f INNER JOIN my_notes n ON f.note_id = n.note_id  INNER JOIN notebooks nb ON n.notebook_id = nb.notebook_id WHERE nb.notebook_id = :notebookId")
    void deleteFilesByNotebookIdWithJoins(@Param("notebookId") int notebookId);

}
