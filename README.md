CodeArena - Coding Platform

A Full Stack Coding Platform built using MERN Stack.

🔥 About

CodeArena is a full-stack coding platform where users can solve programming problems, submit solutions, and get real-time execution results. It includes role-based access for admin problem management and secure authentication using JWT.

🛠 Tech Stack

Frontend:

React (Vite)

Tailwind CSS

Axios

Backend:

Node.js

Express.js

MongoDB

JWT Authentication

Other:

Judge0 API (Code Execution)

✨ Features

🔐 Secure Login & Signup (JWT)

👨‍💻 Solve Coding Problems

⚡ Real-time Code Execution

🛠 Admin Panel for Problem Management

🌐 RESTful APIs

🎯 Role-Based Access Control

📁 Project Structure
CodeArena/
 ├── frontend/
 └── backend/

⚙️ Installation (Local Setup)
1️⃣ Clone Repository
git clone https://github.com/aditya8957/CodeArena.git
cd CodeArena

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

DB_CONNECT_STRING
PORT
JWT_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET


Run backend:

node server.js

3️⃣ Frontend Setup
cd frontend
npm install


Create .env file:

VITE_API_URL=http://localhost:4000


Run frontend:

npm run dev

🌍 Deployment

Backend → Render

Frontend → Vercel

Database → MongoDB Atlas

👨‍💻 Author

Aditya Pratap 

B.Tech CSE | MERN Developer
