# ═══════════════════════════════════════════════════════════════
# Sales Pilot — Backend Dockerfile
# Multi-stage build: Maven build → slim JRE 21 runtime
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Build ──────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests -B


# ── Stage 2: Runtime ────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Security: non-root user
RUN addgroup -S salespilot && adduser -S salespilot -G salespilot

WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads && chown salespilot:salespilot /app/uploads

COPY --from=builder /app/target/*.jar app.jar
COPY --from=builder --chown=salespilot:salespilot /app/target/*.jar app.jar

USER salespilot

VOLUME ["/app/uploads"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q --spider http://localhost:8080/api/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-XX:+UseG1GC", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
