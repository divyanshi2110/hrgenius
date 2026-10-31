package com.hrgenius.modules.health;

import com.hrgenius.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkHealth() {
        Map<String, Object> healthData = new LinkedHashMap<>();
        healthData.put("application", "HRGenius Enterprise HRMS");
        healthData.put("status", "UP");
        healthData.put("version", "1.0.0");
        healthData.put("phase", "Phase 1: Project Foundation");
        healthData.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.success(healthData, "HRGenius backend service is running"));
    }

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong", "Backend responded successfully"));
    }
}
