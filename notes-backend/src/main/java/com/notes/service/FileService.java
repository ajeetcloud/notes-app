package com.notes.service;

import com.notes.model.File;
import com.notes.util.HibernateUtil;
import org.springframework.stereotype.Service;

@Service
public class FileService {

    public void deleteFile(int fileId) {
        File file = new File();
        file.setFileId(fileId);
        HibernateUtil.delete(file);
    }
}
