# HRGenius — Enterprise HR Management System (HRMS)

![HRGenius Architecture](https://img.shields.io/badge/Architecture-Full%20Stack%20Enterprise-blue.svg)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.3.4-brightgreen.svg)
![Angular](https://img.shields.io/badge/Frontend-Angular%2021-red.svg)
![Database](https://img.shields.io/badge/Database-Oracle%20XE-orange.svg)
![Security](https://img.shields.io/badge/Security-Spring%20Security%206%20%7C%20JWT-yellow.svg)

HRGenius is a modern enterprise Human Resource Management System designed with clean architectural boundaries, robust relational persistence on Oracle Database, stateless JWT authentication, and a responsive corporate design system built with Angular 21.

---

## Key System Modules

1. **Executive HR Dashboard** (`/dashboard`): High-level organizational KPIs, active headcount, real-time attendance rate, pending leave queue, and department distribution charts.
2. **Employee Data Management & Directory** (`/employees`): Employee master records, multi-level reporting hierarchies, departmental filters, profile dossier modal, and employee CRUD operations.
3. **Talent Acquisition & ATS** (`/recruitment`): Open job requisitions, interactive 6-stage Kanban candidate tracking (*Sourced &rarr; Screening &rarr; Technical &rarr; Managerial &rarr; Offer &rarr; Hired*), star ratings, and interview round scheduling.
4. **Employee Onboarding** (`/onboarding`): Joiner roadmap, interactive multi-category induction checklists (HR KYC, IT hardware provisioning, orientation, probation reviews) with real-time progress recalibration, and IT asset allocation registers.
5. **Workforce Operations (Attendance & Leaves)** (`/attendance-leave`): Daily clock-in/out logging, biometric attendance status, annual leave balance quotas (Casual, Sick, Privilege), and managerial approval workflows.
6. **Payroll & Compensation Engine** (`/payroll`): Salary structure definition (Basic, HRA, Special, Conveyance, EPF 12%, Professional Tax, TDS), monthly payroll batch processing, loss-of-pay deduction, and printable corporate PDF payslips with amount-in-words converter.
7. **Performance Management System (PMS)** (`/performance`): Strategic departmental OKR goal tracker with real-time milestone adjusters, 360-degree appraisal scorecards, competency ratings (1–5), promotion recommendation flags, and review timelines.
8. **Statutory Compliance & Governance** (`/compliance`): EPFO ECR, ESIC Form 5, Professional Tax, TDS 24Q, POSH Annual Report, Gratuity Trust valuations with challan receipt logging, and corporate policy repository.
9. **Enterprise Reports & Workforce Analytics** (`/reports`): 5 audited standard corporate registers (Master Workforce Census, Monthly Attendance Muster Roll, Payroll Bank Transfer Register, Leave Liability Ledger, and Department Cost Allocation) with one-click **Export to CSV** file downloader and print-optimized views.

---

## Technology Stack

### Backend
* **Framework**: Spring Boot 3.3.4 (Java 21 LTS)
* **Security**: Spring Security 6 with stateless JWT authentication & BCrypt salted password hashing
* **Persistence**: Spring Data JPA / Hibernate
* **Database**: Oracle Database (Oracle XE on port 1521)
* **Connection Pool**: HikariCP

### Frontend
* **Framework**: Angular 21
* **Architecture**: Standalone Components, Angular Signals, SCSS modular design tokens
* **Icons**: Crisp inline SVG iconography (zero external font dependencies)
* **Design System**: Modeled after enterprise corporate software (Workday, SAP SuccessFactors)

---

## Getting Started

### Prerequisites
* **Java**: JDK 21+
* **Node.js**: v18+ / v20+ / v25+
* **Database**: Oracle Database XE running on `localhost:1521` with credentials matching `application.yml`

### 1. Run the Backend
```bash
cd hrgenius-backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8081`.*

### 2. Run the Frontend
```bash
cd hrgenius-frontend
npm install
npm start
```
*Frontend runs on `http://localhost:4200`.*

---

## Cloud & Production Deployment

For complete, step-by-step instructions on deploying the frontend to **Vercel** / **Netlify** and backend to **Render** / **Railway** or running via **Docker**, see:
* **[DEPLOYMENT.md](DEPLOYMENT.md)** — Production & Cloud Deployment Guide
* **Docker Compose**: Run `docker compose up --build -d` for single-command full-stack containerization.
* **Vercel**: Preconfigured via `vercel.json` and `hrgenius-frontend/vercel.json`.
* **Render**: Preconfigured via `render.yaml` and `hrgenius-backend/Dockerfile`.

---

## Default Credentials (Local Evaluation)

| Role | Username | Password | Linked Employee | Permissions |
|---|---|---|---|---|
| **ROLE_ADMIN** | `admin` | `Admin@123` | `EMP-001` (Rajesh Kumar, HR Director) | Full system administration, approvals, payroll, compliance |
| **ROLE_MANAGER** | `manager` | `Manager@123` | `EMP-002` (Priya Sharma, Engineering Lead) | Direct report oversight, leave approvals, appraisal reviews |
| **ROLE_EMPLOYEE** | `employee` | `Employee@123` | `EMP-003` (Amit Verma, Senior Software Engineer) | Self-service attendance, leave requests, pay slips, OKRs |

*Newly created employee accounts have the default password: **`Welcome@123`**.*

---

## License
MIT License. Developed for enterprise HR operations and portfolio evaluation.
