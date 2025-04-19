// src/main/java/com/example/computersales/service/FileStorageService.java
package com.example.computersales.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads");

    public FileStorageService() throws IOException {
        Files.createDirectories(uploadDir);
    }

    public List<String> storeAll(List<MultipartFile> files) throws IOException {
        return files.stream()
                    .limit(5) // enforce max 5
                    .map(this::store)
                    .collect(Collectors.toList());
    }

    private String store(MultipartFile file) {
        try {
            String filename = System.currentTimeMillis()
                    + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            // this URL assumes you serve uploads/ at "/uploads/**"
            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), ex);
        }
    }
}
