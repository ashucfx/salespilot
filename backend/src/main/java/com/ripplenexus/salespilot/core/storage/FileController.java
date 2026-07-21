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
    private final DatabaseFileRepository fileRepository;

    @Operation(summary = "Upload a file")
    @PostMapping("/upload")
    @org.springframework.security.access.prepost.PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder
    ) {
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf") && !contentType.equals("text/csv"))) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid file type. Only images, PDFs, and CSVs are allowed."));
        }
        
        String path = fileStorageService.store(file, folder);
        String url = fileStorageService.getUrl(path);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", url));
    }

    @Operation(summary = "Download a file")
    @GetMapping("/{fileId}")
    @org.springframework.security.access.prepost.PreAuthorize("permitAll()")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileId) {
        try {
            java.util.UUID id = java.util.UUID.fromString(fileId);
            return fileRepository.findById(id).map(file -> 
                ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, file.getContentType())
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                    .body(file.getData())
            ).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
