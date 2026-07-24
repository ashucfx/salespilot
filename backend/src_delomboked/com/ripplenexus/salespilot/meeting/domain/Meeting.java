package com.ripplenexus.salespilot.meeting.domain;

import com.ripplenexus.salespilot.employee.domain.Employee;
import com.ripplenexus.salespilot.lead.domain.Company;
import com.ripplenexus.salespilot.lead.domain.Contact;
import com.ripplenexus.salespilot.lead.domain.Lead;
import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "meetings")
public class Meeting {

    public enum MeetingType { ONLINE, OFFLINE, PHONE_CALL }
    public enum MeetingStatus { SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    private Employee organizer;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    
    private MeetingType type = MeetingType.ONLINE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    
    private MeetingStatus status = MeetingStatus.SCHEDULED;

    @Column(name = "scheduled_at", nullable = false)
    private Instant scheduledAt;

    @Column(name = "duration_minutes", nullable = false)
    
    private Integer durationMinutes = 60;

    @Column(name = "location")
    private String location;

    @Column(name = "meeting_url")
    private String meetingUrl;

    @Column(name = "agenda")
    private String agenda;

    @Column(name = "notes")
    private String notes;

    @Column(name = "outcome")
    private String outcome;

    @Column(name = "next_action")
    private String nextAction;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "meeting_attendees",
            joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    @org.hibernate.annotations.Fetch(org.hibernate.annotations.FetchMode.SUBSELECT)
    
    private Set<Employee> attendees = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Lead getLead() { return lead; }
    public void setLead(Lead lead) { this.lead = lead; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }
    public Employee getOrganizer() { return organizer; }
    public void setOrganizer(Employee organizer) { this.organizer = organizer; }
    public MeetingType getType() { return type; }
    public void setType(MeetingType type) { this.type = type; }
    public MeetingStatus getStatus() { return status; }
    public void setStatus(MeetingStatus status) { this.status = status; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getMeetingUrl() { return meetingUrl; }
    public void setMeetingUrl(String meetingUrl) { this.meetingUrl = meetingUrl; }
    public String getAgenda() { return agenda; }
    public void setAgenda(String agenda) { this.agenda = agenda; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }
    public String getNextAction() { return nextAction; }
    public void setNextAction(String nextAction) { this.nextAction = nextAction; }
    public Set<Employee> getAttendees() { return attendees; }
    public void setAttendees(Set<Employee> attendees) { this.attendees = attendees; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getDeletedAt() { return deletedAt; }
    public void setDeletedAt(Instant deletedAt) { this.deletedAt = deletedAt; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
}
