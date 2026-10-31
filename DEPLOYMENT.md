# HRGenius Cloud & Production Deployment Guide

HRGenius supports both **Direct GitHub Deployment (GitHub Pages & Actions)** and **Full Cloud Hosting (Vercel + Render / Railway)**.

---

## 1. Direct GitHub Pages Deployment (Zero Third-Party Accounts)

Your repository already includes a fully automated GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds Angular and publishes directly to GitHub Pages.

### Live URL Format:
```
https://divyanshi2110.github.io/hrgenius/
```

### How to Enable GitHub Pages in 1 Click:
1. Open your repository on GitHub:
   [https://github.com/divyanshi2110/hrgenius/settings/pages](https://github.com/divyanshi2110/hrgenius/settings/pages)
2. Under **Build and deployment** &rarr; **Source**:
   * Select **GitHub Actions** (Recommended) OR **Deploy from a branch** &rarr; select `gh-pages` branch & folder `/ (root)`.
3. Click **Save**.
4. The workflow in the **Actions** tab ([https://github.com/divyanshi2110/hrgenius/actions](https://github.com/divyanshi2110/hrgenius/actions)) will build and deploy the app automatically!
5. Once complete, your live site is live at:
   **`https://divyanshi2110.github.io/hrgenius/`**

> [!TIP]
> The app is built with an automatic Cloud Demo Mode: anyone testing the GitHub Pages link can sign in with `admin` / `Admin@123`, `manager` / `Manager@123`, or `employee` / `Employee@123` to test all 16 employees, recruitment Kanban, onboarding checklists, OKRs, payroll, and compliance filings seamlessly.

---

## 2. Frontend Deployment via Vercel (Alternative)

If you prefer Vercel for custom domain management or edge caching:
1. Open [vercel.com/new](https://vercel.com/new).
2. Import `divyanshi2110/hrgenius`.
3. Root Directory: `hrgenius-frontend` (or root with the included root `package.json`).
4. Framework Preset: **Angular**.
5. Click **Deploy**.

---

## 3. Backend REST API Deployment via Render

For a live cloud Spring Boot backend:
1. Open [dashboard.render.com](https://dashboard.render.com) and click **New +** &rarr; **Web Service**.
2. Connect `divyanshi2110/hrgenius`.
3. Settings:
   * **Root Directory**: `hrgenius-backend`
   * **Runtime**: **Docker** *(or Java with `./mvnw clean package -DskipTests`)*
   * **Plan**: Free
   * **Health Check Path**: `/api/v1/health`
   * **Environment Variables**:
     * `SPRING_PROFILES_ACTIVE`: `cloud`
     * `CORS_ALLOWED_ORIGINS`: `*`
4. Click **Deploy Web Service**.

---

## 4. Single-Command Docker Deployment (Local or VPS)

To spin up both frontend and backend containers together:
```bash
git clone https://github.com/divyanshi2110/hrgenius.git
cd hrgenius
docker compose up --build -d
```

* **Frontend**: `http://localhost`
* **Backend**: `http://localhost:8081`

---

## 5. Enterprise Credentials

| Role | Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `Admin@123` | Full access across all 9 modules |
| **HR Director** | `manager` | `Manager@123` | Approvals, payroll processing, recruitment ATS |
| **Senior Engineer** | `employee` | `Employee@123` | Self-service portal, leave requests, payslips |
