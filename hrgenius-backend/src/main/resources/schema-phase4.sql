-- ========================================================
-- HRGenius Phase 4 Oracle Database Schema
-- Tables: SALARY_STRUCTURES, PAYROLLS
-- ========================================================

CREATE SEQUENCE sal_struct_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE payroll_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 1. SALARY_STRUCTURES Table
CREATE TABLE salary_structures (
    id NUMBER(19) PRIMARY KEY,
    employee_id NUMBER(19) NOT NULL CONSTRAINT uk_sal_emp UNIQUE CONSTRAINT fk_sal_emp REFERENCES employees(id),
    basic_salary NUMBER(12,2) NOT NULL,
    hra NUMBER(12,2) NOT NULL,
    special_allowance NUMBER(12,2) DEFAULT 0 NOT NULL,
    conveyance_allowance NUMBER(12,2) DEFAULT 0 NOT NULL,
    epf_deduction NUMBER(12,2) DEFAULT 0 NOT NULL,
    professional_tax NUMBER(12,2) DEFAULT 0 NOT NULL,
    tds_deduction NUMBER(12,2) DEFAULT 0 NOT NULL,
    bank_name VARCHAR2(100),
    bank_account_no VARCHAR2(50),
    bank_ifsc VARCHAR2(30),
    pan_number VARCHAR2(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PAYROLLS Table
CREATE TABLE payrolls (
    id NUMBER(19) PRIMARY KEY,
    payroll_code VARCHAR2(50) NOT NULL UNIQUE,
    employee_id NUMBER(19) NOT NULL CONSTRAINT fk_pay_emp REFERENCES employees(id),
    pay_month NUMBER(2) NOT NULL,
    pay_year NUMBER(4) NOT NULL,
    total_working_days NUMBER(3) NOT NULL,
    paid_days NUMBER(5,1) NOT NULL,
    lop_days NUMBER(5,1) DEFAULT 0 NOT NULL,
    basic_salary NUMBER(12,2) NOT NULL,
    hra NUMBER(12,2) NOT NULL,
    special_allowance NUMBER(12,2) DEFAULT 0 NOT NULL,
    conveyance_allowance NUMBER(12,2) DEFAULT 0 NOT NULL,
    gross_salary NUMBER(12,2) NOT NULL,
    epf_deduction NUMBER(12,2) DEFAULT 0 NOT NULL,
    professional_tax NUMBER(12,2) DEFAULT 0 NOT NULL,
    tds_deduction NUMBER(12,2) DEFAULT 0 NOT NULL,
    lop_deduction NUMBER(12,2) DEFAULT 0 NOT NULL,
    total_deductions NUMBER(12,2) NOT NULL,
    net_salary NUMBER(12,2) NOT NULL,
    status VARCHAR2(30) DEFAULT 'GENERATED' NOT NULL,
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_pay_emp_month_year UNIQUE (employee_id, pay_month, pay_year)
);

CREATE INDEX idx_pay_emp ON payrolls(employee_id);
CREATE INDEX idx_pay_period ON payrolls(pay_year, pay_month);
CREATE INDEX idx_pay_status ON payrolls(status);
