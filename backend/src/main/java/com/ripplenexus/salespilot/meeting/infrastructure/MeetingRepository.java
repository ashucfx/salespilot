package com.ripplenexus.salespilot.meeting.infrastructure;

import com.ripplenexus.salespilot.meeting.domain.Meeting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, UUID> {
    
    @Query("SELECT m FROM Meeting m WHERE m.deletedAt IS NULL AND m.organizer.id = :organizerId")
    Page<Meeting> findByOrganizerId(UUID organizerId, Pageable pageable);

    @Query("SELECT m FROM Meeting m JOIN m.attendees a WHERE m.deletedAt IS NULL AND a.id = :attendeeId")
    Page<Meeting> findByAttendeeId(UUID attendeeId, Pageable pageable);

    @Query("SELECT m FROM Meeting m WHERE m.deletedAt IS NULL AND m.lead.id = :leadId")
    List<Meeting> findByLeadId(UUID leadId);

    @Query("SELECT m FROM Meeting m WHERE m.deletedAt IS NULL AND m.scheduledAt BETWEEN :start AND :end")
    List<Meeting> findBetweenDates(Instant start, Instant end);
}
