# Expentix K8s — Cloud-Native MERN Deployment & Monitoring

> A production-grade Kubernetes deployment of **Expentix**, a full-stack MERN expense tracker, with complete observability using Prometheus, Grafana, and Alertmanager.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Kubernetes Setup](#kubernetes-setup)
- [Monitoring Setup](#monitoring-setup)
- [Ingress & Access](#ingress--access)
- [Grafana Dashboards](#grafana-dashboards)
- [HPA Autoscaling](#hpa-autoscaling)
- [CI/CD Pipeline](#cicd-pipeline)
- [Alertmanager](#alertmanager)
- [Quick Command Reference](#quick-command-reference)

---

## Overview

This project demonstrates a complete **DevOps implementation** of a MERN (MongoDB, Express, React, Node.js) application on Kubernetes with:

- 🐳 **Dockerized** frontend and backend
- ☸️ **Kubernetes** orchestration with namespaces, deployments, services, and persistent storage
- 📈 **Prometheus** metrics scraping from backend (`/metrics`) and MongoDB
- 📊 **Grafana** dashboards for backend performance and MongoDB health
- 🔔 **Alertmanager** for alert routing and notifications
- 🔁 **HPA** (HorizontalPodAutoscaler) for automatic scaling under load
- 🌐 **Nginx Ingress** controller for unified routing
- ⚙️ **GitHub Actions** CI/CD pipeline

---

## Architecture

```
EXTERNAL TRAFFIC
      |
      v
[ Nginx Ingress ]  →  mern-app.local
      |
   ┌──┴────────────────────┐
   v                       v
[ Frontend ]          [ Backend ]  ←── Prometheus scrapes /metrics
  React.js               Node.js
  2 pods (Nginx)         2–10 pods (HPA)
                              |
                              v
                        [ MongoDB ]
                        1 pod + PVC
                              |
                   [ MongoDB Exporter ]
                     port 9216/metrics

┌─────────────────────────────────────────────┐
│  MONITORING NAMESPACE                       │
│                                             │
│  [ Prometheus ]  ←── scrapes all targets    │
│       │                                     │
│       ├──► [ Alertmanager ]                 │
│       │      routes: critical / warning     │
│       │                                     │
│  [ Grafana ]  ←── queries Prometheus        │
│    - Backend Dashboard (7 panels)           │
│    - MongoDB Dashboard (7 panels)           │
│    - Kubernetes Cluster (ID 315)            │
│    - Node Exporter (ID 13659)               │
└─────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Nginx |
| Backend | Node.js, Express.js, prom-client |
| Database | MongoDB 6.0 |
| Containerization | Docker |
| Orchestration | Kubernetes (Minikube) |
| Metrics | Prometheus, MongoDB Exporter |
| Visualization | Grafana |
| Alerting | Alertmanager |
| Ingress | Nginx Ingress Controller |
| CI/CD | GitHub Actions |
| Package Manager | Helm |

---

## Project Structure

```
expentix-k8s/
├── frontend/                  # React.js app
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── backend/                   # Node.js + Express API
│   ├── api/v1/
│   │   ├── auth/              # signup, login, OTP
│   │   ├── income/
│   │   ├── expense/
│   │   └── users/
│   ├── models/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   └── Dockerfile
├── k8s/
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   ├── mongodb/
│   │   ├── pv.yaml
│   │   ├── pvc.yaml
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── monitoring/
│   │   ├── prometheus/
│   │   │   ├── servicemonitor.yaml
│   │   │   ├── mongodb-servicemonitor.yaml
│   │   │   └── alerts.yaml
│   │   ├── alertmanager/
│   │   │   └── alertmanager-config.yaml
│   │   └── mongodb-exporter/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── servicemonitor.yaml
│   └── ingress/
│       └── ingress.yaml
├── .github/
│   └── workflows/
│       └── ci.yml
├── scripts/
│   └── deploy.sh
└── README.md
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Docker Desktop | v24+ |
| Minikube | v1.32+ |
| kubectl | v1.28+ |
| Helm | v3.13+ |
| Node.js | v18+ |
| Git | any |

---

## Getting Started

### 1. Start Minikube

```bash
minikube start --driver=docker --memory=4096 --cpus=4
minikube addons enable ingress
minikube addons enable metrics-server
```

### 2. Point Docker CLI to Minikube

```bash
# Run this in every new terminal
eval $(minikube docker-env)          # Linux/macOS
minikube docker-env | Invoke-Expression   # Windows PowerShell
```

### 3. Build Docker Images

```bash
docker build -t mern-frontend:v1.0 ./frontend
docker build -t mern-backend:v1.0  ./backend
```

---

## Kubernetes Setup

### Deploy Everything

```bash
# Create namespace
kubectl create namespace mern-app

# MongoDB (storage first)
kubectl apply -f k8s/mongodb/pv.yaml
kubectl apply -f k8s/mongodb/pvc.yaml
kubectl apply -f k8s/mongodb/deployment.yaml
kubectl apply -f k8s/mongodb/service.yaml

# Wait for MongoDB
kubectl rollout status deployment/mongodb -n mern-app

# Backend + HPA
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/backend/hpa.yaml

# Frontend
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
```

### Verify

```bash
kubectl get pods     -n mern-app
kubectl get services -n mern-app
kubectl get pvc      -n mern-app
kubectl get hpa      -n mern-app
```

Expected output:
```
NAME                     READY   STATUS    RESTARTS
backend-xxx              1/1     Running   0         ← x2
frontend-xxx             1/1     Running   0         ← x2
mongodb-xxx              1/1     Running   0
```

---

## Monitoring Setup

### Install Prometheus Stack via Helm

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring

helm install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set prometheus.prometheusSpec.retention=10d \
  --set alertmanager.enabled=true \
  --set grafana.adminPassword=admin123 \
  --set grafana.service.type=NodePort
```

### Apply Monitoring Manifests

```bash
# Backend ServiceMonitor
kubectl apply -f k8s/monitoring/prometheus/servicemonitor.yaml

# Alert Rules
kubectl apply -f k8s/monitoring/prometheus/alerts.yaml

# Alertmanager Config
kubectl apply -f k8s/monitoring/alertmanager/alertmanager-config.yaml

# MongoDB Exporter
kubectl apply -f k8s/monitoring/mongodb-exporter/deployment.yaml
kubectl apply -f k8s/monitoring/mongodb-exporter/service.yaml
kubectl apply -f k8s/monitoring/mongodb-exporter/servicemonitor.yaml
```

### Access Monitoring UIs

```bash
# Prometheus  →  http://localhost:9090
kubectl port-forward svc/prometheus-stack-kube-prom-prometheus -n monitoring 9090:9090

# Grafana     →  http://localhost:3000  (admin / admin123)
kubectl port-forward svc/prometheus-stack-grafana -n monitoring 3000:80

# Alertmanager → http://localhost:9093
kubectl port-forward svc/prometheus-stack-kube-prom-alertmanager -n monitoring 9093:9093
```

---

## Ingress & Access

### Setup (Windows)

```powershell
# Add to C:\Windows\System32\drivers\etc\hosts
127.0.0.1  mern-app.local

# Start tunnel (keep running in a separate terminal)
minikube tunnel
```

### Routes

| URL | Target |
|-----|--------|
| `http://mern-app.local` | React Frontend |
| `http://mern-app.local/api/v1/auth/signup` | Backend Auth |
| `http://mern-app.local/api/v1/income` | Income API (protected) |
| `http://mern-app.local/api/v1/expense` | Expense API (protected) |

### Auth Flow

```
POST /api/v1/auth/send-otp   →  { "email": "user@example.com" }
POST /api/v1/auth/signup     →  { "email", "password", "otp" }
POST /api/v1/auth/login      →  { "email", "password" }  →  returns token
GET  /api/v1/income          →  Bearer <token>
```

---

## Grafana Dashboards

### Pre-built Community Dashboards (import by ID)

| ID | Dashboard |
|----|-----------|
| 315 | Kubernetes Cluster Monitoring |
| 6417 | Kubernetes Pods Overview |
| 13659 | Node Exporter Full |
| 12079 | MongoDB Exporter |

### Custom Dashboards

**Backend Dashboard — 7 Panels:**
- HTTP Request Rate per Route
- P95 / P50 Latency
- Error Rate %
- Active HTTP Connections
- CPU Usage (total / user / system)
- Memory Usage (heap, RSS, external)
- Event Loop Lag & GC Duration

**MongoDB Dashboard — 7 Panels:**
- Connection count & usage %
- Operation counters (query / insert / update / delete)
- Read & Write latency (µs)
- Memory & WiredTiger cache
- Query efficiency (scan ratio)
- Network I/O (bytes in/out)
- Disk I/O (bytes read/written)

---

## HPA Autoscaling

The backend HPA scales between **2–10 replicas** based on CPU (70% threshold).

```bash
# Check HPA status
kubectl get hpa backend-hpa -n mern-app

# Generate load to trigger scaling
kubectl run load-test --image=busybox -n mern-app -- \
  /bin/sh -c "while true; do wget -q -O- http://backend-service:5000/metrics > /dev/null; done"

# Watch pods scale up
kubectl get hpa backend-hpa -n mern-app -w
```

Observed scaling behavior:
```
cpu: 20%/70%  →  2 replicas  (idle)
cpu: 146%/70% →  5 replicas  (under load)
cpu: 21%/70%  →  2 replicas  (after cooldown)
```

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main` or `develop`:

| Job | Steps |
|-----|-------|
| `frontend` | npm ci → build → docker build |
| `backend` | npm ci → npm test → docker build |
| `k8s-lint` | kubectl dry-run all manifests |
| `all-checks` | Gate — all 3 must pass |

```bash
git add .
git commit -m "your message"
git push origin main
# Pipeline runs automatically on GitHub Actions
```

---

## Alertmanager

### Alert Rules Configured

| Alert | Condition | Severity |
|-------|-----------|----------|
| HighErrorRate | >10% 5xx for 2m | critical |
| HighRequestLatency | P95 > 1s for 2m | warning |
| NoTraffic | 0 requests for 5m | warning |
| PodNotReady | Pod unready for 1m | warning |
| PodCrashLooping | Frequent restarts for 5m | critical |
| PodOOMKilled | Container OOM killed | critical |
| HighCPUUsage | Container CPU > 50% for 2m | warning |
| HighMemoryUsage | Container RAM > 200MB for 5m | warning |
| HPAAtMaxReplicas | HPA at max for 5m | warning |
| MongoDBDown | Exporter unreachable for 1m | critical |
| NodeDiskPressure | Node disk pressure | critical |

### Send a Test Alert

```powershell
Invoke-WebRequest -Uri "http://localhost:9093/api/v2/alerts" `
  -Method POST `
  -ContentType "application/json" `
  -UseBasicParsing `
  -Body '[{"labels":{"alertname":"TestAlert","severity":"warning"},"annotations":{"summary":"Test alert"}}]'
```

---

## Quick Command Reference

```bash
# Cluster
minikube start --memory=4096 --cpus=4
minikube stop
minikube tunnel                              # required for ingress on Windows

# Pods
kubectl get pods -n mern-app
kubectl get pods -n monitoring
kubectl logs -f deployment/backend -n mern-app
kubectl describe pod <pod-name> -n mern-app

# Redeploy
bash scripts/deploy.sh

# Resource usage
kubectl top pods -n mern-app
kubectl top nodes

# Cleanup
kubectl delete namespace mern-app
kubectl delete namespace monitoring
helm uninstall prometheus-stack -n monitoring
```

---

## 👤 Author

**Pavan Kumar**
B.Tech CSE — 4th Year
INT334 — Cloud & DevOps Project

---

## 📄 License

This project is for academic purposes.