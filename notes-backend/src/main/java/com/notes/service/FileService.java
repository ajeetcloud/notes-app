package com.notes.service;

import com.notes.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Transactional
    public void deleteFile(int fileId) {
       /* File file = new File();
        file.setFileId(fileId);
        HibernateUtil.delete(file);*/

        fileRepository.deleteFilesByFileId(fileId);
    }
}
