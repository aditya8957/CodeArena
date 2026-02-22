# 🚀 CodeArena – Full Stack Coding Platform

CodeArena is a Full Stack Coding Platform built using the MERN Stack.  
Users can solve coding problems, submit solutions, and receive real-time execution results.  
It includes secure authentication and role-based admin access for managing problems.

---

## 🔥 Features

- 🔐 Secure Login & Signup using JWT
- 👨‍💻 Solve Coding Problems
- ⚡ Real-Time Code Execution (Judge0 API)
- 🛠 Admin Panel for Problem Management
- 🌐 RESTful API Architecture
- 🎯 Role-Based Access Control (User / Admin)
- ☁️ Cloudinary Integration (if used)
- 📦 Full MERN Stack Implementation

---

## 🛠 Tech Stack

### 💻 Frontend
- React (Vite)
- Tailwind CSS
- Axios

### 🖥 Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### ⚙️ External Services
- Judge0 API (Code Execution)
- MongoDB Atlas (Database)
- Render (Backend Deployment)
- Vercel (Frontend Deployment)

---

## 📁 Project Structure

```
CodeArena/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
└── backend/
    ├── controllers/
    ├── routes/
    ├── models/
    ├── middleware/
    └── server.js
```

---

# 🚀 Local Installation Guide

Follow the steps below to run the project locally.

---

## 📁 1️⃣ Clone Repository

```bash
git clone https://github.com/aditya8957/CodeArena.git
cd CodeArena
```

---

## 🖥 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### 🔐 Create `.env` file inside backend folder:

```env
DB_CONNECT=your_mongodb_connection_string
PORT=4000
JWT_KEY=your_jwt_secret_key
Judge0=your_api_key
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
```

### ▶️ Run Backend

```bash
node server.js
```

Backend will run at:

```
http://localhost:4000
```

---

## 💻 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

### 🔐 Create `.env` file inside frontend folder:

```env
VITE_API_URL=http://localhost:4000
```

### ▶️ Run Frontend

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🌍 Deployment

- Backend → Render  
- Frontend → Vercel  
- Database → MongoDB Atlas  

---

# 🛡️ Security Notice

- Do NOT commit `.env` files
- Add `.env` to `.gitignore`
- Keep JWT and API keys private

Example `.gitignore`:

```bash
node_modules
.env
dist
```

---
---

# 📜 License

© 2026 Aditya Pratap. All Rights Reserved.

This project and its source code are the intellectual property of Aditya Pratap.

---



# 👨‍💻 Author

**Aditya Pratap**  
B.Tech CS | MERN Stack Developer  
GitHub: https://github.com/aditya8957

---

# ⭐ If You Like This Project

Give it a ⭐ on GitHub and feel free to contribute!
