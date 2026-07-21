package com.ripplenexus.salespilot.core.storage;

import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * Re-implemented LocalFileStorageService that uses PostgreSQL for persistence
 * to ensure 100% data retention on ephemeral free-tier cloud platforms (Render, Railway).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService {

    private final DatabaseFileRepository fileRepository;

    @Override
    @Transactional
    public String store(MultipartFile file, String folder) {
        if (file.isEmpty()) {
            throw new BusinessException("Cannot store empty file.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        UUID fileId = UUID.randomUUID();
        String filename = fileId + extension;
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        try {
            DatabaseFileEntity entity = DatabaseFileEntity.builder()
                    .id(fileId)
                    .filename(filename)
                    .contentType(contentType)
                    .folder(folder)
                    .data(file.getBytes())
                    .build();

            fileRepository.save(entity);
            log.debug("File stored in database: {}/{}", folder, filename);
            
            return fileId.toString(); // Return UUID as the relative path identifier
        } catch (IOException e) {
            log.error("Failed to read file bytes: {}", e.getMessage());
            throw new BusinessException("Failed to store file. Please try again.");
        }
    }

    @Override
    @Transactional
    public void delete(String fileIdString) {
        try {
            UUID fileId = UUID.fromString(fileIdString);
            fileRepository.deleteById(fileId);
            log.debug("Deleted file from database: {}", fileId);
        } catch (IllegalArgumentException e) {
            log.warn("Attempted to delete invalid file ID format: {}", fileIdString);
        }
    }

    @Override
    public String getUrl(String fileIdString) {
        return "/api/files/" + fileIdString;
    }

    @Override
    public boolean exists(String fileIdString) {
        try {
            UUID fileId = UUID.fromString(fileIdString);
            return fileRepository.existsById(fileId);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
