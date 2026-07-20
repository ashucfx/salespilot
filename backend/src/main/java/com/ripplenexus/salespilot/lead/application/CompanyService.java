package com.ripplenexus.salespilot.lead.application;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.exception.BusinessException;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.lead.domain.Company;
import com.ripplenexus.salespilot.lead.infrastructure.CompanyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;

    public PageResponse<Company> getAllCompanies(Pageable pageable) {
        return PageResponse.of(companyRepository.findByDeletedAtIsNull(pageable));
    }

    public Company getCompany(UUID id) {
        return getOrThrow(id);
    }

    public Company createCompany(Company company) {
        if (companyRepository.existsByNameIgnoreCase(company.getName())) {
            throw new BusinessException("Company with name '" + company.getName() + "' already exists.");
        }
        return companyRepository.save(company);
    }

    public Company updateCompany(UUID id, Company request) {
        Company company = getOrThrow(id);
        
        if (!company.getName().equalsIgnoreCase(request.getName()) && 
            companyRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BusinessException("Company with name '" + request.getName() + "' already exists.");
        }

        company.setName(request.getName());
        company.setWebsite(request.getWebsite());
        company.setIndustry(request.getIndustry());
        company.setEmployeeCount(request.getEmployeeCount());
        company.setAnnualRevenue(request.getAnnualRevenue());
        company.setCountry(request.getCountry());
        company.setCity(request.getCity());
        company.setAddress(request.getAddress());
        company.setNotes(request.getNotes());
        
        return companyRepository.save(company);
    }

    public void deleteCompany(UUID id) {
        Company company = getOrThrow(id);
        company.setDeletedAt(Instant.now());
        companyRepository.save(company);
    }

    private Company getOrThrow(UUID id) {
        return companyRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
    }
}
