package com.notes;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotesController {

    @GetMapping("/notes/all")
    public String getAllNotes() {
        return "some notes";
    }

}
