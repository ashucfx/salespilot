package com.ripplenexus.salespilot.lead.presentation;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.dto.ResponseDto;
import com.ripplenexus.salespilot.lead.application.ContactService;
import com.ripplenexus.salespilot.lead.domain.Contact;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<PageResponse<Contact>>> getAll(Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(contactService.getAll(pageable)));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<PageResponse<Contact>>> getByCompany(@PathVariable UUID companyId, Pageable pageable) {
        return ResponseEntity.ok(ResponseDto.success(contactService.getByCompany(companyId, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Contact>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ResponseDto.success(contactService.getContact(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Contact>> create(@Valid @RequestBody Contact contact) {
        return ResponseEntity.ok(ResponseDto.success(contactService.createContact(contact)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER', 'SALES_EXEC')")
    public ResponseEntity<ResponseDto<Contact>> update(@PathVariable UUID id, @Valid @RequestBody Contact contact) {
        return ResponseEntity.ok(ResponseDto.success(contactService.updateContact(id, contact)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_MANAGER')")
    public ResponseEntity<ResponseDto<Void>> delete(@PathVariable UUID id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok(ResponseDto.success(null));
    }
}
