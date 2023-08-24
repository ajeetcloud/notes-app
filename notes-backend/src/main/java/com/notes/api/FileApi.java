package com.notes.api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/file")
public interface FileApi {

    @DeleteMapping("/{fileId}")
    void deleteFile(@PathVariable int fileId);
}
