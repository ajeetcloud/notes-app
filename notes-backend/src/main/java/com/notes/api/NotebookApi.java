package com.notes.api;

import com.notes.model.Notebook;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/notebook")
public interface NotebookApi {

    @GetMapping("/")
    List<Object[]> getAllNotebooks();

    @PostMapping("/")
    Notebook createNotebook(@RequestBody Notebook notebook);
}
