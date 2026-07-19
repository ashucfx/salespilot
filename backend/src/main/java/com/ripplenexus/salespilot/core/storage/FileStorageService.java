package com.ripplenexus.salespilot.core.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String store(MultipartFile file, String folder);

    void delete(String filePath);

    String getUrl(String filePath);

    boolean exists(String filePath);
}
