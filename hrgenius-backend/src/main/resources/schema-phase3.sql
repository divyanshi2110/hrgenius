-- ========================================================
-- HRGenius Phase 3 Oracle Database Schema
-- Tables: ATTENDANCE, LEAVE_TYPES, LEAVE_REQUESTS
-- ========================================================

-- Sequences
CREATE SEQUENCE attendance_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE leave_type_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE leave_req_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 1. ATTENDANCE Table
CREATE TABLE attendance (
    id NUMBER(19) PRIMARY KEY,
    employee_id NUMBER(19) NOT NULL CONSTRAINT fk_att_emp REFERENCES employees(id),
    attendance_date DATE NOT NULL,
    status VARCHAR2(30) NOT NULL,
    check_in_time VARCHAR2(10),
    check_out_time VARCHAR2(10),
    work_hours NUMBER(5,2),
    remarks VARCHAR2(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_att_emp_date UNIQUE (employee_id, attendance_date)
);

-- 2. LEAVE_TYPES Table
CREATE TABLE leave_types (
    id NUMBER(19) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL UNIQUE,
    description VARCHAR2(255),
    annual_allocation NUMBER(5) NOT NULL,
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. LEAVE_REQUESTS Table
CREATE TABLE leave_requests (
    id NUMBER(19) PRIMARY KEY,
    employee_id NUMBER(19) NOT NULL CONSTRAINT fk_lr_emp REFERENCES employees(id),
    leave_type_id NUMBER(19) NOT NULL CONSTRAINT fk_lr_type REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMBER(5) NOT NULL,
    reason VARCHAR2(500) NOT NULL,
    status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    approved_by NUMBER(19) CONSTRAINT fk_lr_approver REFERENCES employees(id),
    approved_at TIMESTAMP,
    rejection_reason VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_att_emp ON attendance(employee_id);
CREATE INDEX idx_att_date ON attendance(attendance_date);
CREATE INDEX idx_lr_emp ON leave_requests(employee_id);
CREATE INDEX idx_lr_status ON leave_requests(status);
