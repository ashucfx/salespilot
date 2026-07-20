package com.ripplenexus.salespilot.lead.application;

import com.ripplenexus.salespilot.core.dto.PageResponse;
import com.ripplenexus.salespilot.core.exception.ResourceNotFoundException;
import com.ripplenexus.salespilot.lead.domain.IdealCustomerProfile;
import com.ripplenexus.salespilot.lead.infrastructure.ICPRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ICPService {

    private final ICPRepository icpRepository;

    public PageResponse<IdealCustomerProfile> getAll(Pageable pageable) {
        return PageResponse.of(icpRepository.findByDeletedAtIsNull(pageable));
    }

    public IdealCustomerProfile getICP(UUID id) {
        return getOrThrow(id);
    }

    public IdealCustomerProfile createICP(IdealCustomerProfile icp) {
        return icpRepository.save(icp);
    }

    public IdealCustomerProfile updateICP(UUID id, IdealCustomerProfile request) {
        IdealCustomerProfile icp = getOrThrow(id);
        
        icp.setName(request.getName());
        icp.setIndustry(request.getIndustry());
        icp.setCompanySizeMin(request.getCompanySizeMin());
        icp.setCompanySizeMax(request.getCompanySizeMax());
        icp.setRevenueMin(request.getRevenueMin());
        icp.setRevenueMax(request.getRevenueMax());
        icp.setDecisionMakers(request.getDecisionMakers());
        icp.setPainPoints(request.getPainPoints());
        icp.setInterestedServices(request.getInterestedServices());
        if (request.getPriority() != null) {
            icp.setPriority(request.getPriority());
        }
        icp.setDescription(request.getDescription());
        if (request.getIsActive() != null) {
            icp.setIsActive(request.getIsActive());
        }
        
        return icpRepository.save(icp);
    }

    public void deleteICP(UUID id) {
        IdealCustomerProfile icp = getOrThrow(id);
        icp.setDeletedAt(Instant.now());
        icpRepository.save(icp);
    }

    private IdealCustomerProfile getOrThrow(UUID id) {
        return icpRepository.findById(id)
                .filter(c -> c.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("IdealCustomerProfile", id));
    }
}
