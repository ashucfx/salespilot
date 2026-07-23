package com.ripplenexus.salespilot.core.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ripplenexus.salespilot.core.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * A lightweight, in-memory rate limiter using ConcurrentHashMap.
 * Suitable for free-tier deployments (avoids the need for Redis).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    
    // Key: IP Address, Value: [Count, WindowStartTimestamp]
    private final Map<String, long[]> requestCounts = new ConcurrentHashMap<>();

    private static final int AUTH_LIMIT = 10;
    private static final int API_LIMIT = 100;
    private static final long WINDOW_MS = 60000; // 1 minute
    private static final int MAX_MAP_SIZE = 10000;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String ip = getClientIp(request);
        String path = request.getRequestURI();
        
        int limit = path.startsWith("/api/auth/") ? AUTH_LIMIT : API_LIMIT;
        
        if (!allowRequest(ip, limit)) {
            log.warn("Rate limit exceeded for IP: {} on path: {}", ip, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            objectMapper.writeValue(response.getOutputStream(), 
                ApiResponse.error("Too many requests. Please try again later."));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean allowRequest(String ip, int limit) {
        long now = Instant.now().toEpochMilli();

        // Evict stale entries if map size grows large (avoids memory leaks on free tier)
        if (requestCounts.size() > MAX_MAP_SIZE) {
            requestCounts.entrySet().removeIf(entry -> now - entry.getValue()[1] > WINDOW_MS * 2);
        }

        long[] data = requestCounts.computeIfAbsent(ip, k -> new long[]{0, now});
        
        synchronized (data) {
            if (now - data[1] > WINDOW_MS) {
                // Reset window
                data[0] = 1;
                data[1] = now;
                return true;
            }
            
            if (data[0] < limit) {
                data[0]++;
                return true;
            }
            
            return false;
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.trim().isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

