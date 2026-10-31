package com.hrgenius.modules.auth;

import com.hrgenius.common.exception.ApiException;
import com.hrgenius.common.exception.ResourceNotFoundException;
import com.hrgenius.modules.employee.Employee;
import com.hrgenius.modules.employee.EmployeeRepository;
import com.hrgenius.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for user: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (user.getIsActive() == 0) {
            throw new ApiException("User account has been deactivated", HttpStatus.FORBIDDEN);
        }

        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);

        String token = jwtUtil.generateToken(user, employee);

        UserSummaryDto userSummary = buildUserSummary(user, employee);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(userSummary)
                .build();
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);
        return buildUserSummary(user, employee);
    }

    private UserSummaryDto buildUserSummary(User user, Employee employee) {
        UserSummaryDto.UserSummaryDtoBuilder builder = UserSummaryDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole());

        if (employee != null) {
            builder.employeeId(employee.getId())
                    .employeeCode(employee.getEmployeeCode())
                    .fullName(employee.getFullName());

            if (employee.getDepartment() != null) {
                builder.departmentName(employee.getDepartment().getDeptName());
            }
            if (employee.getDesignation() != null) {
                builder.designationTitle(employee.getDesignation().getTitle());
            }
        } else {
            builder.fullName(user.getUsername());
        }

        return builder.build();
    }
}
