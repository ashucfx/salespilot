package com.ripplenexus.salespilot.core.storage;

import com.ripplenexus.salespilot.core.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Slf4j
@Service
public class LocalFileStorageService implements FileStorageService {

    @Value("${salespilot.file-storage.local.upload-dir:./uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            log.info("File upload directory initialized: {}", uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    @Override
    public String store(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BusinessException("Cannot store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID() + extension;
        String relativePath = folder + "/" + filename;

        try {
            Path targetDir = Paths.get(uploadDir, folder);
            Files.createDirectories(targetDir);
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.debug("File stored: {}", relativePath);
            return relativePath;
        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage());
            throw new BusinessException("Failed to store file. Please try again.");
        }
    }

    @Override
    public void delete(String filePath) {
        try {
            Path path = Paths.get(uploadDir, filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", filePath);
        }
    }

    @Override
    public String getUrl(String filePath) {
        return "/api/files/" + filePath;
    }

    @Override
    public boolean exists(String filePath) {
        return Files.exists(Paths.get(uploadDir, filePath));
    }
}
