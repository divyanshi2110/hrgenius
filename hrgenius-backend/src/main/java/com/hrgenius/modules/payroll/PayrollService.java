package com.hrgenius.modules.payroll;

import com.hrgenius.common.exception.ApiException;
import com.hrgenius.common.exception.ResourceNotFoundException;
import com.hrgenius.modules.employee.Employee;
import com.hrgenius.modules.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayrollService {

    private final SalaryStructureRepository salaryStructureRepository;
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    // ==========================================
    // SALARY STRUCTURE
    // ==========================================

    @Transactional(readOnly = true)
    public List<SalaryStructureResponse> getAllSalaryStructures() {
        return salaryStructureRepository.findAllWithEmployee().stream()
                .map(this::mapToSalaryStructureResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalaryStructureResponse getSalaryStructureByEmployeeId(Long employeeId) {
        SalaryStructure structure = salaryStructureRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Salary structure not configured for employee ID " + employeeId));
        return mapToSalaryStructureResponse(structure);
    }

    @Transactional
    public SalaryStructureResponse saveOrUpdateSalaryStructure(SalaryStructureRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID " + request.getEmployeeId()));

        SalaryStructure structure = salaryStructureRepository.findByEmployeeId(request.getEmployeeId())
                .orElseGet(() -> SalaryStructure.builder().employee(employee).build());

        structure.setBasicSalary(request.getBasicSalary());
        structure.setHra(request.getHra());
        structure.setSpecialAllowance(request.getSpecialAllowance() != null ? request.getSpecialAllowance() : BigDecimal.ZERO);
        structure.setConveyanceAllowance(request.getConveyanceAllowance() != null ? request.getConveyanceAllowance() : BigDecimal.ZERO);
        structure.setEpfDeduction(request.getEpfDeduction() != null ? request.getEpfDeduction() : BigDecimal.ZERO);
        structure.setProfessionalTax(request.getProfessionalTax() != null ? request.getProfessionalTax() : BigDecimal.ZERO);
        structure.setTdsDeduction(request.getTdsDeduction() != null ? request.getTdsDeduction() : BigDecimal.ZERO);
        structure.setBankName(request.getBankName());
        structure.setBankAccountNo(request.getBankAccountNo());
        structure.setBankIfsc(request.getBankIfsc());
        structure.setPanNumber(request.getPanNumber());

        SalaryStructure saved = salaryStructureRepository.save(structure);
        return mapToSalaryStructureResponse(saved);
    }

    // ==========================================
    // PAYROLL PROCESSING & RETRIEVAL
    // ==========================================

    @Transactional(readOnly = true)
    public List<PayrollResponse> getPayrolls(Long employeeId, Integer month, Integer year, String status) {
        return payrollRepository.searchAndFilter(employeeId, month, year, status).stream()
                .map(this::mapToPayrollResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PayrollResponse getPayrollById(Long id) {
        Payroll payroll = payrollRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found with ID " + id));
        return mapToPayrollResponse(payroll);
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getPayrollsByEmployeeId(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToPayrollResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<PayrollResponse> processPayroll(PayrollProcessRequest request) {
        List<Employee> targetEmployees;

        if (request.getEmployeeId() != null) {
            Employee emp = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID " + request.getEmployeeId()));
            targetEmployees = List.of(emp);
        } else {
            targetEmployees = employeeRepository.findByStatus("ACTIVE");
        }

        if (targetEmployees.isEmpty()) {
            throw new ApiException("No active employees found to process payroll");
        }

        int daysInMonth = (request.getTotalWorkingDays() != null && request.getTotalWorkingDays() > 0)
                ? request.getTotalWorkingDays()
                : YearMonth.of(request.getPayYear(), request.getPayMonth()).lengthOfMonth();

        List<PayrollResponse> processedList = new ArrayList<>();

        for (Employee emp : targetEmployees) {
            SalaryStructure structure = salaryStructureRepository.findByEmployeeId(emp.getId()).orElse(null);
            if (structure == null) {
                log.warn("Skipping payroll for {} ({}) - no salary structure configured", emp.getFullName(), emp.getEmployeeCode());
                continue;
            }

            BigDecimal lopDays = (request.getCustomLopDays() != null)
                    ? request.getCustomLopDays()
                    : BigDecimal.ZERO;

            BigDecimal paidDays = BigDecimal.valueOf(daysInMonth).subtract(lopDays);
            if (paidDays.compareTo(BigDecimal.ZERO) < 0) {
                paidDays = BigDecimal.ZERO;
            }

            BigDecimal gross = structure.getBasicSalary()
                    .add(structure.getHra())
                    .add(structure.getSpecialAllowance())
                    .add(structure.getConveyanceAllowance());

            BigDecimal perDayRate = gross.divide(BigDecimal.valueOf(daysInMonth), 2, RoundingMode.HALF_UP);
            BigDecimal lopDeduction = perDayRate.multiply(lopDays).setScale(2, RoundingMode.HALF_UP);

            BigDecimal totalDeductions = structure.getEpfDeduction()
                    .add(structure.getProfessionalTax())
                    .add(structure.getTdsDeduction())
                    .add(lopDeduction);

            BigDecimal netSalary = gross.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);
            if (netSalary.compareTo(BigDecimal.ZERO) < 0) {
                netSalary = BigDecimal.ZERO;
            }

            String payrollCode = String.format("PAY-%d-%02d-%s", request.getPayYear(), request.getPayMonth(), emp.getEmployeeCode());

            Payroll payroll = payrollRepository.findByEmployeeIdAndPayMonthAndPayYear(emp.getId(), request.getPayMonth(), request.getPayYear())
                    .orElseGet(() -> Payroll.builder()
                            .employee(emp)
                            .payMonth(request.getPayMonth())
                            .payYear(request.getPayYear())
                            .payrollCode(payrollCode)
                            .build());

            payroll.setTotalWorkingDays(daysInMonth);
            payroll.setPaidDays(paidDays);
            payroll.setLopDays(lopDays);
            payroll.setBasicSalary(structure.getBasicSalary());
            payroll.setHra(structure.getHra());
            payroll.setSpecialAllowance(structure.getSpecialAllowance());
            payroll.setConveyanceAllowance(structure.getConveyanceAllowance());
            payroll.setGrossSalary(gross);
            payroll.setEpfDeduction(structure.getEpfDeduction());
            payroll.setProfessionalTax(structure.getProfessionalTax());
            payroll.setTdsDeduction(structure.getTdsDeduction());
            payroll.setLopDeduction(lopDeduction);
            payroll.setTotalDeductions(totalDeductions);
            payroll.setNetSalary(netSalary);
            payroll.setStatus("GENERATED");

            Payroll saved = payrollRepository.save(payroll);
            processedList.add(mapToPayrollResponse(saved));
        }

        return processedList;
    }

    @Transactional
    public PayrollResponse updatePayrollStatus(Long id, String status) {
        Payroll payroll = payrollRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll record not found with ID " + id));

        payroll.setStatus(status);
        if ("PAID".equalsIgnoreCase(status) && payroll.getPaymentDate() == null) {
            payroll.setPaymentDate(LocalDate.now());
        }
        Payroll saved = payrollRepository.save(payroll);
        return mapToPayrollResponse(saved);
    }

    // ==========================================
    // MAPPERS
    // ==========================================

    private SalaryStructureResponse mapToSalaryStructureResponse(SalaryStructure s) {
        BigDecimal gross = s.getBasicSalary()
                .add(s.getHra())
                .add(s.getSpecialAllowance())
                .add(s.getConveyanceAllowance());

        BigDecimal totalDed = s.getEpfDeduction()
                .add(s.getProfessionalTax())
                .add(s.getTdsDeduction());

        BigDecimal net = gross.subtract(totalDed);

        return SalaryStructureResponse.builder()
                .id(s.getId())
                .employeeId(s.getEmployee().getId())
                .employeeCode(s.getEmployee().getEmployeeCode())
                .employeeName(s.getEmployee().getFullName())
                .departmentName(s.getEmployee().getDepartment() != null ? s.getEmployee().getDepartment().getDeptName() : "N/A")
                .designationTitle(s.getEmployee().getDesignation() != null ? s.getEmployee().getDesignation().getTitle() : "N/A")
                .basicSalary(s.getBasicSalary())
                .hra(s.getHra())
                .specialAllowance(s.getSpecialAllowance())
                .conveyanceAllowance(s.getConveyanceAllowance())
                .grossSalary(gross)
                .epfDeduction(s.getEpfDeduction())
                .professionalTax(s.getProfessionalTax())
                .tdsDeduction(s.getTdsDeduction())
                .totalDeductions(totalDed)
                .netSalary(net)
                .bankName(s.getBankName())
                .bankAccountNo(s.getBankAccountNo())
                .bankIfsc(s.getBankIfsc())
                .panNumber(s.getPanNumber())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    private PayrollResponse mapToPayrollResponse(Payroll p) {
        SalaryStructure structure = salaryStructureRepository.findByEmployeeId(p.getEmployee().getId()).orElse(null);

        return PayrollResponse.builder()
                .id(p.getId())
                .payrollCode(p.getPayrollCode())
                .employeeId(p.getEmployee().getId())
                .employeeCode(p.getEmployee().getEmployeeCode())
                .employeeName(p.getEmployee().getFullName())
                .departmentName(p.getEmployee().getDepartment() != null ? p.getEmployee().getDepartment().getDeptName() : "N/A")
                .designationTitle(p.getEmployee().getDesignation() != null ? p.getEmployee().getDesignation().getTitle() : "N/A")
                .panNumber(structure != null ? structure.getPanNumber() : "N/A")
                .bankName(structure != null ? structure.getBankName() : "N/A")
                .bankAccountNo(structure != null ? structure.getBankAccountNo() : "N/A")
                .bankIfsc(structure != null ? structure.getBankIfsc() : "N/A")
                .payMonth(p.getPayMonth())
                .payYear(p.getPayYear())
                .totalWorkingDays(p.getTotalWorkingDays())
                .paidDays(p.getPaidDays())
                .lopDays(p.getLopDays())
                .basicSalary(p.getBasicSalary())
                .hra(p.getHra())
                .specialAllowance(p.getSpecialAllowance())
                .conveyanceAllowance(p.getConveyanceAllowance())
                .grossSalary(p.getGrossSalary())
                .epfDeduction(p.getEpfDeduction())
                .professionalTax(p.getProfessionalTax())
                .tdsDeduction(p.getTdsDeduction())
                .lopDeduction(p.getLopDeduction())
                .totalDeductions(p.getTotalDeductions())
                .netSalary(p.getNetSalary())
                .netSalaryInWords(NumberToWordsConverter.convertToIndianCurrency(p.getNetSalary()))
                .status(p.getStatus())
                .paymentDate(p.getPaymentDate())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
