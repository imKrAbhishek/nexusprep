# 🚀 NexusPrep | AI-Powered EdTech & Learning Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![AI Integration](https://img.shields.io/badge/AI-RAG_Architecture-purple?style=for-the-badge)

NexusPrep is a full-stack, scalable e-learning platform designed for competitive exam preparation (GATE, JEE, CAT, Placements). Built entirely from scratch, it features a secure Role-Based Access Control (RBAC) system, real-time progress tracking, and an integrated **AI Doubt Solver** powered by Retrieval-Augmented Generation (RAG).

---

## ✨ Core Features

- **🔐 Secure RBAC Architecture:** Distinct dashboards, UI conditional rendering, and backend route protection for Students, Teachers, and Master Admins.
- **🧠 Context-Aware AI Assistant (RAG):** AI Doubt Solver that answers student queries dynamically based on specific lecture notes and course materials.
- **📚 Dynamic Course Engine:** Instructors can build rich courses, embed video lectures, and generate multilingual transcripts (Hindi/English).
- **📊 Telemetry & Progress Tracking:** Real-time database aggregation for tracking student progress, curriculum hours, and active enrollments.
- **🛡️ Robust Backend:** Custom JWT authentication, Bcrypt password hashing, and strict Mongoose schema validation.

---

# 📸 Platform Gallery

## 1. Master Admin Console & Telemetry

*(Shows system-wide metrics, RBAC implementation, and database health)*

<br>

<img src="./screenshots/Screenshot 2026-07-12 104450.png" width="800" alt="Admin Dashboard">

---

## 2. Context-Aware AI Doubt Solver (RAG)

*(Demonstrates the AI assistant utilizing specific lecture context to answer technical queries)*

<br>

<img src="./screenshots/Screenshot 2026-07-12 110613.png" width="800" alt="AI Solver">

---

## 3. Student Learning Environment

*(Features embedded video player, module tracking, and Hindi transcript generation)*

<br>

<img src="./screenshots/Screenshot 2026-07-12 110504.png" width="800" alt="Video Classroom">

---

## 4. Real-Time Progress Tracking

*(Showcases MongoDB data aggregation and dynamic UI updates)*

<br>

<img src="./screenshots/Screenshot 2026-07-12 110541.png" width="800" alt="Progress Dashboard">

---

## 5. Instructor Course Builder

*(Highlights the Teacher portal for creating dynamic curriculum)*

<br>

<img src="./screenshots/Screenshot 2026-07-12 105404.png" width="800" alt="Course Builder">

---

## 6. Secure Authentication Flow

*(Demonstrates custom email validation and role-selection routing)*

<br>

<img src="./screenshots/Screenshot 2026-07-12 104355.png" width="800" alt="Auth Flow">

---

# ⚙️ Quick Start & Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/yourusername/nexusprep.git
cd nexusprep
```

## 2. Install Dependencies

### Install backend dependencies

```bash
cd backend
npm install
```

### Install frontend dependencies

```bash
cd ../nexus-prep
npm install
```

## 3. Environment Configuration

Create a `.env` file in the **backend** directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/nexusprep
JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## 4. Start the Application

### Run the backend

```bash
cd backend
npm run start
```

### Run the frontend

```bash
cd nexus-prep
npm start
```

---

# 🔌 Backend Integration Guide

| Feature | Service Implementation | Mechanism |
|---------|-------------------------|-----------|
| Auth Flow | `src/services/authService.js` | JWT stored securely, context hydrated via `getMe()` on mount. |
| Course Data | `src/services/courseService.js` | Fetches aggregated Mongoose models; handles specific RBAC visibility. |
| AI Doubts | `src/pages/dashboard/AiDoubts.jsx` | Connects to LLM endpoints passing lecture notes as RAG context. |

---

# 👨‍💻 About the Developer

**Abhishek Kumar**

A software engineering student and full-stack developer with a strong focus on backend architecture and artificial intelligence. I specialize in the MERN stack (MongoDB, Express.js, React, Node.js) and have deep knowledge in implementing advanced AI solutions, including Generative AI and Retrieval-Augmented Generation (RAG). Alongside web development, I am an active competitive programmer utilizing C++ to solve complex algorithmic problems.