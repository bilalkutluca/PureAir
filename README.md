# PureAir: Real-Time Air Quality Monitoring & Telemetry Platform

> **Collaborative Project:** Developed jointly by **Bilal Kutluca** ([@bilalkutluca](https://github.com/bilalkutluca)) and **Busenur Kutluca** ([@busenurkutluca](https://github.com/busenurkutluca)).

---

## Project Overview & Objectives
**PureAir** is a high-performance, real-time web platform engineered to ingest, aggregate, and visualize environmental telemetry data globally. The platform processes continuous streams of air quality metrics—via automated sensor ingestion pipelines and manual input streams—detects environmental anomalies dynamically, and delivers actionable insights to end users through interactive geospatial maps, analytical dashboards, and real-time alert dispatchers.

---

## System Architecture & Key Components
* **Backend Core:** Enterprise-grade RESTful API powered by **Java (Spring Boot)** structured around a robust monolithic architectural design.
* **Frontend Dashboard:** Modern, reactive, and responsive user interface implemented with **React.js**, optimized for real-time telemetry rendering.
* **Time-Series Persistence:** **TimescaleDB** (PostgreSQL-optimized time-series database engine) tuned for high-frequency write operations, data retention, and temporal analytical queries.
* **Asynchronous Message Broker:** Distributed event streaming powered by **Apache Kafka** for decoupled message ingestion and fault-tolerant anomaly notification pipelines.
* **Real-Time Event Dispatch:** Full-duplex **WebSocket (STOMP)** protocol layer pushing instant anomaly notifications and live sensor metric broadcasts to connected clients.
* **Containerization & Orchestration:** Fully containerized multi-tier environment managed via **Docker & Docker Compose** for streamlined, single-command zero-downtime provisioning.

---

## Technology Stack & Architectural Decisions

| Layer / Technology | Role & Strategic Justification |
| :--- | :--- |
| **Java / Spring Boot** | Delivers enterprise reliability, strictly typed domain logic, built-in security, and scalable dependency management. |
| **React.js** | Provides declarative state management and highly componentized UI structures suited for intensive live data streaming. |
| **TimescaleDB** | Offers seamless PostgreSQL ecosystem compatibility while scaling time-series analytical performance via hypertable auto-partitioning. |
| **Apache Kafka** | Serves as the industry-standard high-throughput, low-latency backbone for fault-tolerant data streaming and event queuing. |
| **Docker & Compose** | Guarantees environmental parity, isolated service lifecycles, and rapid one-click deployment across environments. |

---

## Contributors & Collaboration
This project represents a joint engineering effort by:
* **Bilal Kutluca** – [@bilalkutluca](https://github.com/bilalkutluca)
* **Busenur Kutluca** – [@busenurkutluca](https://github.com/busenurkutluca)