Project Setup Guide

🔹 Frontend – Next.js

📁 Location: /frontend

📦 Install Dependencies

npm install

🚀 Start Development Server

npm run dev

🛠️ .env File (Frontend)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

NEXT_PUBLIC_BACKEND_URL_FASTAPI=http://localhost:5000

NEXT_PUBLIC_BACKEND_URL=http://localhost:8085

🔹 Backend-javascript – Node.js

📁 Location: /backend

📦 Install Dependencies

npm install

🚀 Start Server

npm start

🛠️ .env File (Backend - Node.js)

CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

MONGODB_URL=mongodb://127.0.0.1:27017/rag

🔹 Backend-python – FastAPI with LangChain , LangGraph

📁 Location: /fastapi-backend (or wherever your FastAPI project is)

🛠️ .env File (FastAPI)

OPENAI_API_KEY=

🚀 Start Server

uvicorn main:app --reload
