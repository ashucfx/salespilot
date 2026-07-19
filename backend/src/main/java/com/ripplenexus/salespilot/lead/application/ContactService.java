package com.ripplenexus.salespilot.lead.application;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.lead.domain.Contact;
import com.ripplenexus.salespilot.lead.infrastructure.ContactRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ContactService {

    private final ContactRepository contactRepository;

    public PageResponse<Contact> getAll(Pageable pageable) {
        return PageResponse.of(contactRepository.findByDeletedAtIsNull(pageable));
    }

    public PageResponse<Contact> getByCompany(UUID companyId, Pageable pageable) {
        return PageResponse.of(contactRepository.findByCompanyIdAndDeletedAtIsNull(companyId, pageable));
    }

    public Contact getContact(UUID id) {
        return getOrThrow(id);
    }

    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public Contact updateContact(UUID id, Contact request) {
        Contact contact = getOrThrow(id);
        
        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setJobTitle(request.getJobTitle());
        contact.setDepartment(request.getDepartment());
        contact.setLinkedinUrl(request.getLinkedinUrl());
        contact.setPrimary(request.isPrimary());
        contact.setNotes(request.getNotes());
        
        return contactRepository.save(contact);
    }

    public void deleteContact(UUID id) {
        Contact contact = getOrThrow(id);
        contact.setDeletedAt(Instant.now());
        contactRepository.save(contact);
    }

    private Contact getOrThrow(UUID id) {
        return contactRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
    }
}
