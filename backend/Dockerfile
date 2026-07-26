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
RUN mvn clean package -Dmaven.test.skip=true -B


# ── Stage 2: Runtime ────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Security: non-root user
RUN addgroup -S salespilot && adduser -S salespilot -G salespilot

WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads && chown salespilot:salespilot /app/uploads

COPY --from=builder --chown=salespilot:salespilot /app/target/*.jar app.jar

USER salespilot

VOLUME ["/app/uploads"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -q --spider http://localhost:${PORT:-8080}/api/actuator/health || exit 1

# Optimized JVM memory settings for 512MB RAM containers (Render free tier):
# -Xms128m -Xmx256m: Caps Max Heap at 256MB
# -XX:MaxMetaspaceSize=128m: Caps class metadata at 128MB
# -XX:ReservedCodeCacheSize=64m: Caps JIT compilation cache
# -Xss384k: Reduces stack memory per thread from 1MB to 384k
# -XX:+UseSerialGC: Eliminates G1GC memory region overhead
# -XX:+TieredCompilation -XX:TieredStopAtLevel=1: Fast startup and lower RAM usage
ENV JAVA_OPTS="-Xms128m -Xmx256m -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=64m -Xss384k -XX:+UseSerialGC -XX:+TieredCompilation -XX:TieredStopAtLevel=1 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
