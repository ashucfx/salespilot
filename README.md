# Sales Pilot 🚀

> **Lead. Close. Grow.**
> 
> Sales Pilot is a production-ready, modular monolith B2B Sales CRM and Sales Operations Platform built with Next.js 15, Spring Boot 3.4, and PostgreSQL.

## 🏗️ Architecture

Sales Pilot is strictly designed as a **Modular Monolith**. It guarantees future microservice extraction capabilities by strictly isolating domains, without incurring the overhead of Kubernetes, Kafka, or distributed tracing on Day 1.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, Zustand, Axios
- **Backend**: Java 21, Spring Boot 3.4.2, Spring Security, Hibernate/JPA
- **Database**: PostgreSQL 16
- **Migrations**: Flyway
- **Deployment**: Docker Compose & Nginx (Reverse Proxy)

### Core Modules
1. **Auth & Identity**: JWT-based session management with RBAC (Admin, Manager, Exec).
2. **Employee Management**: Profile, assignment, and data isolation.
3. **Lead Hub**: Companies, Contacts, Ideal Customer Profiles (ICPs), and Leads.
4. **Pipeline Engine**: Kanban state management and automated lead status mutation.
5. **Activity Tracking**: Timeline logging, Tasks, Meetings, and Follow-ups.
6. **Closing & Revenue**: Proposals, Deals, and Payments.
7. **Commission Engine**: Tiered/Fixed/Percentage rules and payout tracking.
8. **Targets**: Gamified quota progress tracking.
9. **Admin & Settings**: System configuration, branding, and global audit logging.

## 🚀 Quick Start (Docker)

To run the entire Sales Pilot stack (PostgreSQL, Spring Boot Backend, Next.js Frontend, Nginx Proxy) in production mode:

```bash
# Clone the repository
git clone https://github.com/ripplenexus/salespilot.git
cd salespilot

# Start the services
docker compose -f docker-compose.yml up --build -d
```

### Accessing the Application
- **Frontend**: `http://localhost`
- **Backend API**: `http://localhost/api`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html` (Local development only)

## 🗄️ Database Seeding

Flyway automatically handles schema generation and data seeding.
When the database spins up for the first time, it runs the `V13__seed_data.sql` script, injecting default Admin accounts, commission rules, and pipeline stages so the app is instantly usable.

## 🎨 UI/UX Philosophy

The frontend was meticulously crafted without relying on bloated component libraries. It uses a bespoke design system featuring:
- **Glassmorphism**: Frosted glass panels (`.glass-panel`) over deep indigo/violet animated gradients.
- **Micro-interactions**: Fluid Framer Motion animations across all routing and data interactions.
- **Dark Mode First**: A deeply immersive palette optimized for extended professional usage.

---

*Built by Ripple Nexus.*
