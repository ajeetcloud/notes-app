package com.notes.repository;

import com.notes.model.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotebookRepository extends JpaRepository<Notebook, Integer> {

    @Modifying
    @Query("UPDATE Notebook notebook SET notebook.notebookName = :notebookName, notebook.updatedOn = :updatedOn WHERE notebook.notebookId = :notebookId")
    void updateNotebookByNotebookId(@Param("notebookId") int notebookId, @Param("notebookName") String notebookName, @Param("updatedOn") long updatedOn);

    @Modifying
    @Query("DELETE FROM Notebook notebook WHERE notebook.notebookId = :notebookId")
    void deleteNotebookByNotebookId(int notebookId);

}
