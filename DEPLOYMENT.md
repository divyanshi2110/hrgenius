# HRGenius Cloud & Production Deployment Guide

This guide details how to deploy the HRGenius Enterprise HRMS system to the cloud for free with live public URLs.

---

## 1. Architecture Overview

| Component | Technology | Cloud Host (Recommended) | Configuration Files |
| :--- | :--- | :--- | :--- |
| **Frontend Portal** | Angular 21 (SPA) | **Vercel** / **Netlify** | `vercel.json`, `netlify.toml` |
| **Backend REST API** | Spring Boot 3.3.4 (Java 21) | **Render** / **Railway** | `Dockerfile`, `render.yaml`, `mvnw` |
| **Database** | Oracle XE / Cloud H2 / PostgreSQL | Embedded Cloud or Managed DB | `application.yml` (`cloud`/`postgres` profiles) |

---

## 2. Frontend Deployment (Vercel) — 2 Minutes

Vercel natively integrates with GitHub and auto-deploys on every commit.

### Steps:
1. Log in to [Vercel](https://vercel.com/) with your GitHub account (`divyanshi2110`).
2. Click **Add New...** &rarr; **Project**.
3. Locate `divyanshi2110/hrgenius` and click **Import**.
4. Configure Project:
   * **Root Directory**: Click `Edit` and select `hrgenius-frontend`.
   * **Framework Preset**: Angular (automatically detected).
   * **Build Command**: `npm run build` (default).
   * **Output Directory**: `dist/hrgenius-frontend/browser` (preconfigured in `vercel.json`).
5. (Optional) Under **Environment Variables**, add:
   * `HRGENIUS_API_URL`: Your deployed backend URL (e.g. `https://hrgenius-backend.onrender.com/api/v1`).
6. Click **Deploy**.
7. In ~60 seconds, your live production URL (e.g. `https://hrgenius-xxx.vercel.app`) will be active.

---

## 3. Backend Deployment (Render) — 3 Minutes

Render hosts Java / Docker web services with automatic HTTPS and free continuous deployment.

### Steps:
1. Log in to [Render Dashboard](https://dashboard.render.com/) with your GitHub account.
2. Click **New +** &rarr; **Web Service**.
3. Connect your repository: `divyanshi2110/hrgenius`.
4. Configure the service:
   * **Name**: `hrgenius-backend`
   * **Region**: Oregon (or closest to you)
   * **Root Directory**: `hrgenius-backend`
   * **Runtime**: Select **Docker** (recommended; utilizes the included multi-stage Java 21 container).
     *(Alternatively, select `Java` with Build Command `./mvnw clean package -DskipTests` and Start Command `java -jar target/hrgenius-backend-1.0.0.jar`)*
   * **Instance Type**: **Free**
5. Expand **Advanced** and set:
   * **Health Check Path**: `/api/v1/health`
   * **Environment Variables**:
     * `PORT`: `8081`
     * `SPRING_PROFILES_ACTIVE`: `cloud` *(launches with autonomous cloud mode, pre-seeding all 16 enterprise employees, attendance, and payroll)*
     * `CORS_ALLOWED_ORIGINS`: `*` *(or your specific Vercel URL)*
6. Click **Create Web Service**.
7. Render will build and deploy the container. Once live, test your health check at:
   `https://<your-service-name>.onrender.com/api/v1/health`

---

## 4. Alternative: Netlify Deployment (Frontend)

If you prefer Netlify:
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** &rarr; **Import an existing project**.
3. Select GitHub &rarr; `divyanshi2110/hrgenius`.
4. The included `netlify.toml` automatically configures:
   * Base: `hrgenius-frontend`
   * Publish: `dist/hrgenius-frontend/browser`
   * Build command: `npm run build`
5. Click **Deploy Site**.

---

## 5. Alternative: Single-Command Docker Deployment (Local or VPS)

To run the entire system on a virtual server (e.g., AWS EC2, DigitalOcean, Linode) or locally:

```bash
# Clone the repository
git clone https://github.com/divyanshi2110/hrgenius.git
cd hrgenius

# Build and start all services
docker compose up --build -d
```

* **Frontend Portal**: `http://localhost`
* **Backend API**: `http://localhost:8081`
* **Health Check**: `http://localhost:8081/api/v1/health`

---

## 6. Default Login Credentials

Once deployed, the following enterprise accounts are available immediately:

| Role | Username | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin` | `Admin@123` | Full administrative privileges across all modules |
| **HR Director** | `manager` | `Manager@123` | Approvals, payroll processing, recruitment ATS |
| **Senior Engineer** | `employee` | `Employee@123` | Self-service portal, leave requests, payslips |
