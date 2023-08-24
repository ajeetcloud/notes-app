package com.notes.controller;

import com.notes.api.FileApi;
import com.notes.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FileController implements FileApi {

    @Autowired
    FileService fileService;

    @Override
    public void deleteFile(int fileId) {
        fileService.deleteFile(fileId);
    }
}
