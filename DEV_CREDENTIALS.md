# HRGenius Local Development Credentials & Enterprise Master Reference

> [!NOTE]
> All passwords are stored in the Oracle database as **BCrypt salted hashes**.
> Default password for all newly created employee corporate accounts: **`Welcome@123`**.

---

### Core Development Login Accounts

| Role | Username | Password | Email | Linked Employee Code & Name | Permissions Summary |
|---|---|---|---|---|---|
| **ROLE_ADMIN** | `admin` | `Admin@123` | `admin@hrgenius.internal` | `EMP-001` (Rajesh Kumar, HR Director) | Full enterprise administration, all modules, approvals, payroll, compliance, and reporting. |
| **ROLE_MANAGER** | `manager` | `Manager@123` | `manager@hrgenius.internal` | `EMP-002` (Priya Sharma, Engineering Lead) | Direct reports management, leave reviews & approvals, team appraisal scorecards. |
| **ROLE_EMPLOYEE** | `employee` | `Employee@123` | `employee@hrgenius.internal` | `EMP-003` (Amit Verma, Senior Software Engineer) | Employee self-service: attendance clock in/out, apply leave, view pay slips, view OKRs. |

---

### Active Enterprise Workforce Roster (16 Employees Across 8 Departments)

| Employee Code | Full Name | Department | Designation | Reporting Manager | Corporate Email |
|---|---|---|---|---|---|
| `EMP-001` | Rajesh Kumar | Human Resources & Talent | Director of Human Resources | *Board of Directors* | `admin@hrgenius.internal` |
| `EMP-002` | Priya Sharma | Software Engineering | Engineering Lead | Rajesh Kumar | `manager@hrgenius.internal` |
| `EMP-003` | Amit Verma | Software Engineering | Senior Software Engineer | Priya Sharma | `employee@hrgenius.internal` |
| `EMP-004` | Sneha Patel-Mehta | Quality Assurance & Testing | Senior QA Automation Engineer | Priya Sharma | `sneha.patel@hrgenius.internal` |
| `EMP-005` | Rohan Deshmukh | Cloud Operations & SecOps | Principal Cloud Architect | Rajesh Kumar | `rohan.deshmukh@hrgenius.internal` |
| `EMP-006` | Ananya Sen | Product & UX Design | Lead Product Manager | Rajesh Kumar | `ananya.sen@hrgenius.internal` |
| `EMP-007` | Karthik Iyer | Product & UX Design | Senior UX/UI Designer | Rajesh Kumar | `karthik.iyer@hrgenius.internal` |
| `EMP-008` | Vikramaditya Roy | Finance & Operations | Financial Controller | Rajesh Kumar | `vikram.roy@hrgenius.internal` |
| `EMP-009` | Meera Nair | Enterprise Sales & Marketing | Enterprise Account Executive | Rajesh Kumar | `meera.nair@hrgenius.internal` |
| `EMP-010` | Arjun Kapoor | Data Science & AI Analytics | Senior Data Scientist | Priya Sharma | `arjun.kapoor@hrgenius.internal` |
| `EMP-011` | Neha Singhania | Human Resources & Talent | Technical Recruiter | Rajesh Kumar | `neha.singhania@hrgenius.internal` |
| `EMP-012` | Siddharth Malhotra | Cloud Operations & SecOps | DevOps & SRE Specialist | Rajesh Kumar | `siddharth.m@hrgenius.internal` |
| `EMP-013` | Divya Krishnan | Software Engineering | Senior Frontend Architect | Priya Sharma | `divya.krishnan@hrgenius.internal` |
| `EMP-014` | Tanvi Hegde | Finance & Operations | Payroll Specialist | Rajesh Kumar | `tanvi.hegde@hrgenius.internal` |
| `EMP-015` | Aditya Joshi | Cloud Operations & SecOps | Cybersecurity Specialist | Rajesh Kumar | `aditya.joshi@hrgenius.internal` |
| `EMP-016` | Pooja Agarwal | Enterprise Sales & Marketing | Marketing & Growth Lead | Rajesh Kumar | `pooja.agarwal@hrgenius.internal` |

---

### Complete Enterprise System Modules

1. **Dashboard** (`/dashboard`): Executive KPI cards, real-time headcount metrics (16 employees, 8 departments), attendance rate, pending approval queue.
2. **Employees** (`/employees`): Employee master directory, departments, designations, profile view, add/edit employee with auto-generated employee codes.
3. **Recruitment & ATS** (`/recruitment`): Open job requisitions, interactive Kanban applicant tracking system (Sourced &rarr; Screening &rarr; Technical &rarr; Managerial &rarr; Offer &rarr; Hired), candidate dossier, and interview round scheduler.
4. **Onboarding** (`/onboarding`): Joiner tracking, interactive multi-step induction checklist (HR KYC, IT Hardware, Orientation, 30-Day Check-in), real-time progress recalibration, and IT hardware asset register.
5. **Attendance & Leaves** (`/attendance-leave`): Daily clock-in/out, biometric status logs, leave quota balances (Casual, Sick, Privilege), leave request submission, and manager approval/rejection.
6. **Payroll Engine** (`/payroll`): Salary structure definition (Basic, HRA, Special, Deductions), monthly payroll processing, salary breakdown calculation, and printable corporate PDF payslips.
7. **Performance (PMS)** (`/performance`): Annual appraisal cycles, strategic departmental OKRs & goals with real-time completion tracking, 360-degree review scorecards, and promotion recommendations.
8. **Statutory Compliance** (`/compliance`): EPFO, ESIC, Professional Tax, TDS 24Q, POSH Act filings matrix with challan numbers, institutional policy repository, and labor audit checklist.
9. **Enterprise Reports** (`/reports`): Master workforce census, monthly attendance muster roll, payroll bank transfer register, leave liability ledger, department compensation distribution, with one-click **Export to CSV** and print views.
