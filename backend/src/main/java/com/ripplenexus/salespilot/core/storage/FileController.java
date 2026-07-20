package com.ripplenexus.salespilot.core.storage;

import com.ripplenexus.salespilot.core.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload endpoints")
public class FileController {

    private final FileStorageService fileStorageService;

    @Operation(summary = "Upload a file")
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder
    ) {
        String path = fileStorageService.store(file, folder);
        String url = fileStorageService.getUrl(path);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", url));
    }
}
