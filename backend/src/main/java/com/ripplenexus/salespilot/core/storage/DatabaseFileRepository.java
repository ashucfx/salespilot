package com.ripplenexus.salespilot.core.storage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DatabaseFileRepository extends JpaRepository<DatabaseFileEntity, UUID> {
}
