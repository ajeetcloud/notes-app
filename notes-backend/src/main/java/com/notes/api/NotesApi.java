package com.notes.api;

import com.notes.model.Note;
import com.notes.model.NotePage;
import com.notes.util.SortBy;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/notes")
public interface NotesApi {

    @GetMapping("/")
    List<Note> getAllNotes();

    @PostMapping("/")
    Note createNote(@RequestBody Note note);

    @PutMapping("/")
    Note updateNote(@RequestBody Note note);

    @DeleteMapping("/{noteId}")
    void deleteNote(@PathVariable int noteId);

    @GetMapping("/search")
    NotePage getSearchResults(@RequestParam String query, @RequestParam int pageNo, @RequestParam Optional<Integer> pageSize);

    @GetMapping("/searchv2")
    Page<?> getPaginatedSearchResults(@RequestParam String query, @RequestParam int pageNo, @RequestParam Optional<Integer> pageSize, @RequestParam Optional<SortBy> sortBy);
}
