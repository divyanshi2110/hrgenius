package com.hrgenius.config;

import com.hrgenius.modules.attendance.Attendance;
import com.hrgenius.modules.attendance.AttendanceRepository;
import com.hrgenius.modules.auth.User;
import com.hrgenius.modules.auth.UserRepository;
import com.hrgenius.modules.employee.*;
import com.hrgenius.modules.leave.LeaveRequest;
import com.hrgenius.modules.leave.LeaveRequestRepository;
import com.hrgenius.modules.leave.LeaveType;
import com.hrgenius.modules.leave.LeaveTypeRepository;
import com.hrgenius.modules.payroll.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final LeaveTypeRepository leaveTypeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final PayrollRepository payrollRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedUsersAndEmployees();
        seedLeaveTypes();
        seedAttendanceAndLeaves();
        seedPayrollData();
    }

    private void seedUsersAndEmployees() {
        if (userRepository.count() > 0) {
            log.info("Database already initialized with users. Skipping user seed.");
            return;
        }

        log.info("Seeding initial corporate departments, designations, and development users...");

        // 1. Departments
        Department deptHr = departmentRepository.save(Department.builder()
                .deptCode("HR")
                .deptName("Human Resources & Talent")
                .description("Talent acquisition, employee lifecycle, and HR governance")
                .isActive(1)
                .build());

        Department deptEng = departmentRepository.save(Department.builder()
                .deptCode("ENG")
                .deptName("Software Engineering")
                .description("Product engineering, architecture, and technology infrastructure")
                .isActive(1)
                .build());

        Department deptFin = departmentRepository.save(Department.builder()
                .deptCode("FIN")
                .deptName("Finance & Operations")
                .description("Financial reporting, compensation planning, and payroll operations")
                .isActive(1)
                .build());

        // 2. Designations
        Designation desigHrDirector = designationRepository.save(Designation.builder()
                .title("Director of Human Resources")
                .bandLevel("M2")
                .department(deptHr)
                .isActive(1)
                .build());

        Designation desigEngLead = designationRepository.save(Designation.builder()
                .title("Engineering Lead")
                .bandLevel("M1")
                .department(deptEng)
                .isActive(1)
                .build());

        Designation desigSoftwareEngineer = designationRepository.save(Designation.builder()
                .title("Senior Software Engineer")
                .bandLevel("E2")
                .department(deptEng)
                .isActive(1)
                .build());

        // 3. Users with BCrypt-hashed passwords
        User adminUser = userRepository.save(User.builder()
                .username("admin")
                .email("admin@hrgenius.internal")
                .password(passwordEncoder.encode("Admin@123"))
                .role("ROLE_ADMIN")
                .isActive(1)
                .build());

        User managerUser = userRepository.save(User.builder()
                .username("manager")
                .email("manager@hrgenius.internal")
                .password(passwordEncoder.encode("Manager@123"))
                .role("ROLE_MANAGER")
                .isActive(1)
                .build());

        User employeeUser = userRepository.save(User.builder()
                .username("employee")
                .email("employee@hrgenius.internal")
                .password(passwordEncoder.encode("Employee@123"))
                .role("ROLE_EMPLOYEE")
                .isActive(1)
                .build());

        // 4. Employees with Hierarchy (Rajesh Kumar -> Priya Sharma -> Amit Verma)
        Employee empAdmin = employeeRepository.save(Employee.builder()
                .employeeCode("EMP-001")
                .firstName("Rajesh")
                .lastName("Kumar")
                .email("admin@hrgenius.internal")
                .phone("+91 98765 43210")
                .hireDate(LocalDate.of(2021, 1, 15))
                .department(deptHr)
                .designation(desigHrDirector)
                .reportingManager(null)
                .user(adminUser)
                .status("ACTIVE")
                .build());

        Employee empManager = employeeRepository.save(Employee.builder()
                .employeeCode("EMP-002")
                .firstName("Priya")
                .lastName("Sharma")
                .email("manager@hrgenius.internal")
                .phone("+91 98765 43211")
                .hireDate(LocalDate.of(2022, 3, 1))
                .department(deptEng)
                .designation(desigEngLead)
                .reportingManager(empAdmin) // Priya reports to Rajesh
                .user(managerUser)
                .status("ACTIVE")
                .build());

        employeeRepository.save(Employee.builder()
                .employeeCode("EMP-003")
                .firstName("Amit")
                .lastName("Verma")
                .email("employee@hrgenius.internal")
                .phone("+91 98765 43212")
                .hireDate(LocalDate.of(2023, 7, 10))
                .department(deptEng)
                .designation(desigSoftwareEngineer)
                .reportingManager(empManager) // Amit reports to Priya
                .user(employeeUser)
                .status("ACTIVE")
                .build());

        log.info("Phase 2 seed completed: 3 departments, 3 designations, 3 users, 3 employees with reporting hierarchy.");
    }

    private void seedLeaveTypes() {
        if (leaveTypeRepository.count() > 0) {
            return;
        }

        log.info("Seeding initial corporate leave types...");
        leaveTypeRepository.save(LeaveType.builder()
                .name("Casual Leave")
                .description("Casual and short-duration personal leave")
                .annualAllocation(12)
                .isActive(1)
                .build());

        leaveTypeRepository.save(LeaveType.builder()
                .name("Sick Leave")
                .description("Medical illness, health checkups, and recovery leave")
                .annualAllocation(10)
                .isActive(1)
                .build());

        leaveTypeRepository.save(LeaveType.builder()
                .name("Privilege Leave")
                .description("Annual earned privilege / vacation leave")
                .annualAllocation(15)
                .isActive(1)
                .build());

        log.info("Phase 3 seed: 3 standard leave types created.");
    }

    private void seedAttendanceAndLeaves() {
        LocalDate today = LocalDate.now();

        employeeRepository.findByEmployeeCode("EMP-001").ifPresent(emp -> {
            if (!attendanceRepository.existsByEmployeeIdAndAttendanceDate(emp.getId(), today)) {
                attendanceRepository.save(Attendance.builder()
                        .employee(emp)
                        .attendanceDate(today)
                        .status("PRESENT")
                        .checkInTime("09:00")
                        .checkOutTime("17:30")
                        .workHours(8.5)
                        .remarks("On-site Executive Office")
                        .build());
            }
        });

        employeeRepository.findByEmployeeCode("EMP-002").ifPresent(emp -> {
            if (!attendanceRepository.existsByEmployeeIdAndAttendanceDate(emp.getId(), today)) {
                attendanceRepository.save(Attendance.builder()
                        .employee(emp)
                        .attendanceDate(today)
                        .status("WORK_FROM_HOME")
                        .checkInTime("09:15")
                        .checkOutTime("18:00")
                        .workHours(8.75)
                        .remarks("Engineering Sprint Planning - WFH")
                        .build());
            }
        });

        employeeRepository.findByEmployeeCode("EMP-003").ifPresent(emp -> {
            if (!attendanceRepository.existsByEmployeeIdAndAttendanceDate(emp.getId(), today)) {
                attendanceRepository.save(Attendance.builder()
                        .employee(emp)
                        .attendanceDate(today)
                        .status("PRESENT")
                        .checkInTime("09:30")
                        .checkOutTime("18:30")
                        .workHours(9.0)
                        .remarks("Core Engineering Floor")
                        .build());
            }

            // Seed a demo pending leave request for EMP-003 (Amit Verma) for testing approval/rejection by EMP-002 (Priya Sharma)
            if (leaveRequestRepository.count() == 0) {
                leaveTypeRepository.findByNameIgnoreCase("Casual Leave").ifPresent(cl -> {
                    LocalDate nextWeek = today.plusDays(4);
                    leaveRequestRepository.save(LeaveRequest.builder()
                            .employee(emp)
                            .leaveType(cl)
                            .startDate(nextWeek)
                            .endDate(nextWeek.plusDays(1))
                            .totalDays(2)
                            .reason("Attending family wedding ceremony")
                            .status("PENDING")
                            .build());
                    log.info("Phase 3 seed: Demo pending leave request created for EMP-003.");
                });
            }
        });

        employeeRepository.findByEmployeeCode("EMP-004").ifPresent(emp -> {
            if (!attendanceRepository.existsByEmployeeIdAndAttendanceDate(emp.getId(), today)) {
                attendanceRepository.save(Attendance.builder()
                        .employee(emp)
                        .attendanceDate(today)
                        .status("PRESENT")
                        .checkInTime("09:00")
                        .checkOutTime("17:45")
                        .workHours(8.75)
                        .remarks("QA Lab Automation")
                        .build());
            }
        });

        log.info("Phase 3 seed: Attendance records verified for today.");
    }

    private void seedPayrollData() {
        if (salaryStructureRepository.count() > 0) {
            return;
        }

        log.info("Seeding corporate salary structures and initial payroll records...");

        employeeRepository.findByEmployeeCode("EMP-001").ifPresent(emp -> {
            SalaryStructure s1 = salaryStructureRepository.save(SalaryStructure.builder()
                    .employee(emp)
                    .basicSalary(new java.math.BigDecimal("90000.00"))
                    .hra(new java.math.BigDecimal("36000.00"))
                    .specialAllowance(new java.math.BigDecimal("24000.00"))
                    .conveyanceAllowance(new java.math.BigDecimal("5000.00"))
                    .epfDeduction(new java.math.BigDecimal("10800.00"))
                    .professionalTax(new java.math.BigDecimal("200.00"))
                    .tdsDeduction(new java.math.BigDecimal("15000.00"))
                    .bankName("HDFC Bank")
                    .bankAccountNo("50100234567890")
                    .bankIfsc("HDFC0001234")
                    .panNumber("ABCPK1234F")
                    .build());

            payrollRepository.save(Payroll.builder()
                    .payrollCode("PAY-2026-10-EMP-001")
                    .employee(emp)
                    .payMonth(10)
                    .payYear(2026)
                    .totalWorkingDays(31)
                    .paidDays(new java.math.BigDecimal("31.0"))
                    .lopDays(java.math.BigDecimal.ZERO)
                    .basicSalary(s1.getBasicSalary())
                    .hra(s1.getHra())
                    .specialAllowance(s1.getSpecialAllowance())
                    .conveyanceAllowance(s1.getConveyanceAllowance())
                    .grossSalary(new java.math.BigDecimal("155000.00"))
                    .epfDeduction(s1.getEpfDeduction())
                    .professionalTax(s1.getProfessionalTax())
                    .tdsDeduction(s1.getTdsDeduction())
                    .lopDeduction(java.math.BigDecimal.ZERO)
                    .totalDeductions(new java.math.BigDecimal("26000.00"))
                    .netSalary(new java.math.BigDecimal("129000.00"))
                    .status("PAID")
                    .paymentDate(LocalDate.of(2026, 10, 30))
                    .build());
        });

        employeeRepository.findByEmployeeCode("EMP-002").ifPresent(emp -> {
            SalaryStructure s2 = salaryStructureRepository.save(SalaryStructure.builder()
                    .employee(emp)
                    .basicSalary(new java.math.BigDecimal("70000.00"))
                    .hra(new java.math.BigDecimal("28000.00"))
                    .specialAllowance(new java.math.BigDecimal("18000.00"))
                    .conveyanceAllowance(new java.math.BigDecimal("4000.00"))
                    .epfDeduction(new java.math.BigDecimal("8400.00"))
                    .professionalTax(new java.math.BigDecimal("200.00"))
                    .tdsDeduction(new java.math.BigDecimal("9000.00"))
                    .bankName("ICICI Bank")
                    .bankAccountNo("001105012345")
                    .bankIfsc("ICIC0000011")
                    .panNumber("BCDPS5678G")
                    .build());

            payrollRepository.save(Payroll.builder()
                    .payrollCode("PAY-2026-10-EMP-002")
                    .employee(emp)
                    .payMonth(10)
                    .payYear(2026)
                    .totalWorkingDays(31)
                    .paidDays(new java.math.BigDecimal("31.0"))
                    .lopDays(java.math.BigDecimal.ZERO)
                    .basicSalary(s2.getBasicSalary())
                    .hra(s2.getHra())
                    .specialAllowance(s2.getSpecialAllowance())
                    .conveyanceAllowance(s2.getConveyanceAllowance())
                    .grossSalary(new java.math.BigDecimal("120000.00"))
                    .epfDeduction(s2.getEpfDeduction())
                    .professionalTax(s2.getProfessionalTax())
                    .tdsDeduction(s2.getTdsDeduction())
                    .lopDeduction(java.math.BigDecimal.ZERO)
                    .totalDeductions(new java.math.BigDecimal("17600.00"))
                    .netSalary(new java.math.BigDecimal("102400.00"))
                    .status("PAID")
                    .paymentDate(LocalDate.of(2026, 10, 30))
                    .build());
        });

        employeeRepository.findByEmployeeCode("EMP-003").ifPresent(emp -> {
            SalaryStructure s3 = salaryStructureRepository.save(SalaryStructure.builder()
                    .employee(emp)
                    .basicSalary(new java.math.BigDecimal("50000.00"))
                    .hra(new java.math.BigDecimal("20000.00"))
                    .specialAllowance(new java.math.BigDecimal("12000.00"))
                    .conveyanceAllowance(new java.math.BigDecimal("3000.00"))
                    .epfDeduction(new java.math.BigDecimal("6000.00"))
                    .professionalTax(new java.math.BigDecimal("200.00"))
                    .tdsDeduction(new java.math.BigDecimal("4500.00"))
                    .bankName("State Bank of India")
                    .bankAccountNo("30987654321")
                    .bankIfsc("SBIN0004567")
                    .panNumber("CDEAV9012H")
                    .build());

            payrollRepository.save(Payroll.builder()
                    .payrollCode("PAY-2026-10-EMP-003")
                    .employee(emp)
                    .payMonth(10)
                    .payYear(2026)
                    .totalWorkingDays(31)
                    .paidDays(new java.math.BigDecimal("31.0"))
                    .lopDays(java.math.BigDecimal.ZERO)
                    .basicSalary(s3.getBasicSalary())
                    .hra(s3.getHra())
                    .specialAllowance(s3.getSpecialAllowance())
                    .conveyanceAllowance(s3.getConveyanceAllowance())
                    .grossSalary(new java.math.BigDecimal("85000.00"))
                    .epfDeduction(s3.getEpfDeduction())
                    .professionalTax(s3.getProfessionalTax())
                    .tdsDeduction(s3.getTdsDeduction())
                    .lopDeduction(java.math.BigDecimal.ZERO)
                    .totalDeductions(new java.math.BigDecimal("10700.00"))
                    .netSalary(new java.math.BigDecimal("74300.00"))
                    .status("PAID")
                    .paymentDate(LocalDate.of(2026, 10, 30))
                    .build());
        });

        log.info("Phase 4 seed: Salary structures and October 2026 payroll records created.");
    }
}
