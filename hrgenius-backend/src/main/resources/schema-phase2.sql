-- ========================================================
-- HRGenius Phase 2 Oracle Database Schema
-- Tables: USERS, DEPARTMENTS, DESIGNATIONS, EMPLOYEES
-- ========================================================

-- Sequences
CREATE SEQUENCE user_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE dept_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE desig_seq START WITH 1 INCREMENT BY 1 NOCACHE;
CREATE SEQUENCE emp_seq START WITH 1 INCREMENT BY 1 NOCACHE;

-- 1. USERS Table (Authentication & RBAC)
CREATE TABLE users (
    id NUMBER(19) PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    password_hash VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    role VARCHAR2(30) NOT NULL,
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DEPARTMENTS Table
CREATE TABLE departments (
    id NUMBER(19) PRIMARY KEY,
    dept_code VARCHAR2(20) NOT NULL UNIQUE,
    dept_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(255),
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DESIGNATIONS Table
CREATE TABLE designations (
    id NUMBER(19) PRIMARY KEY,
    title VARCHAR2(100) NOT NULL,
    band_level VARCHAR2(20),
    department_id NUMBER(19) CONSTRAINT fk_desig_dept REFERENCES departments(id),
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. EMPLOYEES Table (Core HR with Manager Hierarchy)
CREATE TABLE employees (
    id NUMBER(19) PRIMARY KEY,
    employee_code VARCHAR2(30) NOT NULL UNIQUE,
    first_name VARCHAR2(50) NOT NULL,
    last_name VARCHAR2(50) NOT NULL,
    email VARCHAR2(100) NOT NULL UNIQUE,
    phone VARCHAR2(20),
    hire_date DATE NOT NULL,
    status VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL,
    department_id NUMBER(19) CONSTRAINT fk_emp_dept REFERENCES departments(id),
    designation_id NUMBER(19) CONSTRAINT fk_emp_desig REFERENCES designations(id),
    manager_id NUMBER(19) CONSTRAINT fk_emp_mgr REFERENCES employees(id),
    user_id NUMBER(19) CONSTRAINT uk_emp_user UNIQUE CONSTRAINT fk_emp_user REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_emp_desig ON employees(designation_id);
CREATE INDEX idx_emp_mgr ON employees(manager_id);
CREATE INDEX idx_emp_status ON employees(status);
