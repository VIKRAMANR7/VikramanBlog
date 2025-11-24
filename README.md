# Vikraman Blog – Full-Stack MERN Blogging Platform

A modern, production-ready blogging system built with **React, TypeScript, Node.js, Express, MongoDB, ImageKit, and GROQ AI**.
It includes **AI-powered blog generation**, **admin dashboard**, **JWT authentication**, **comment moderation**, and a clean responsive UI.

---

## 🌐 Live Demo

### **Frontend:** https://vikraman-blog.vercel.app/

### **Backend API:** https://vikraman-blog-server.vercel.app/

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Vikraman Blog** is a complete blog management platform designed with production-level coding standards.
It includes:

- AI content generation using **GROQ Llama 3.3**
- Image optimization using **ImageKit**
- Admin panel with authentication & moderation
- Public-facing blog with categories, search, comments
- Modern UI with **TailwindCSS**, **React Router**, and **Motion**

---

## ✨ Features

### 🔥 Core Features

- Create, edit, delete blog posts
- AI-powered article generation
- Publish/unpublish workflow
- Full markdown → HTML rendering
- Image upload (with CDN + WebP optimization)
- Search + category filtering
- Responsive UI
- Comment system with admin approval

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- Axios
- Motion / Framer
- Marked (Markdown parser)
- Moment.js
- React Router DOM

### Backend

- Node.js
- Express.js 5
- TypeScript
- MongoDB + Mongoose
- ImageKit (image storage + optimization)
- GROQ (AI generation)
- Multer (file uploads)
- JWT authentication

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                     │
│   React + TS + Vite + TailwindCSS + Axios + Context API       │
└───────────────────────┬────────────────────────────────────────┘
                        │  HTTPS (REST API)
                        │
┌────────────────────────▼──────────────────────────────────────┐
│                        SERVER (Express API)                   │
│   Auth API   Blog API     Comment API     AI Generation API   │
│   JWT Auth   CRUD Ops     Approval Flow   GROQ Integration    │
└───────────────┬──────────────┬──────────────┬─────────────────┘
                │              │              │
      ┌─────────▼───┐  ┌───────▼────────┐  ┌─────────▼────────┐
      │  MongoDB     │  │ ImageKit CDN   │  │ GROQ AI Engine   │
      │ Blogs        │  │ Optimize/Store │  │ Generate Content │
      │ Comments     │  │ WebP/Resizing  │  │ Llama Models     │
      └──────────────┘  └───────────────┘  └───────────────────┘
```

---

## 🔄 Data Flow Diagrams

### **1. Blog Creation (With Image + AI)**

```
sequenceDiagram
    autonumber
    User->>Frontend: Opens /admin/addBlog
    User->>Frontend: Selects image + fills title, subtitle, category, description
    Frontend->>Backend: POST /api/blog (multipart/form-data)
    Backend->>Auth Middleware: Validate JWT
    Auth Middleware-->>Backend: Allow request

    Backend->>Multer: Parse uploaded image
    Multer-->>Backend: temp file buffer

    Backend->>ImageKit: Upload image
    ImageKit-->>Backend: Return optimized URL

    Backend->>MongoDB: Create new Blog document
    MongoDB-->>Backend: Blog created

    Backend-->>Frontend: 201 Created (blog + image URL)
    Frontend-->>User: Success toast + redirect
```

### **2. AI Content Generation**

```
sequenceDiagram
    autonumber
    Admin->>Frontend: Enters topic prompt and clicks "Generate"
    Frontend->>Backend: POST /api/blog/generate { prompt }
    Backend->>Auth Middleware: Validate JWT
    Auth Middleware-->>Backend: Allow request

    Backend->>GROQ API: Create chat completion request
    GROQ API-->>Backend: Return AI-generated Markdown

    Backend->>Utils (fixMarkdown): Clean + format output
    Utils-->>Backend: Return cleaned markdown

    Backend-->>Frontend: { content: markdown }
    Frontend-->>Admin: Populate editor with AI output
```

### **3. Comment Lifecycle**

```
sequenceDiagram
    autonumber
    User->>Frontend: Submits comment on blog page
    Frontend->>Backend: POST /api/blog/:id/comment { name, content }
    Backend->>MongoDB: Insert comment (isApproved = false)
    MongoDB-->>Backend: Comment saved
    Backend-->>Frontend: Comment pending approval

    Admin->>Frontend: Opens admin/comments
    Frontend->>Backend: GET /api/admin/comments
    Backend->>Auth Middleware: Validate JWT
    Auth Middleware-->>Backend: Allowed
    Backend->>MongoDB: Fetch all comments
    MongoDB-->>Backend: Comments list
    Backend-->>Frontend: List returned

    Admin->>Frontend: Clicks Approve
    Frontend->>Backend: PATCH /api/admin/comment/:id/approve
    Backend->>MongoDB: Update isApproved = true
    MongoDB-->>Backend: Updated
    Backend-->>Frontend: Success
```

### **4. Authentication (JWT)**

```
sequenceDiagram
    autonumber
    Admin->>Frontend: Submits login form
    Frontend->>Backend: POST /api/admin/login
    Backend->>MongoDB: Find admin
    MongoDB-->>Backend: Return match
    Backend->>JWT: Sign token with ADMIN_EMAIL + role
    JWT-->>Backend: Token
    Backend-->>Frontend: { token }
    Frontend->>LocalStorage: Save token
    Frontend-->>Admin: Redirect to /admin
```

### **5. HomePage**

```
sequenceDiagram
    autonumber
    User->>Frontend: Visits homepage
    Frontend->>Backend: GET /api/blog
    Backend->>MongoDB: Fetch all published blogs
    MongoDB-->>Backend: List of blogs
    Backend-->>Frontend: JSON blogs array
    Frontend->>User: Render BlogList + BlogCard
```

---

## 📁 Project Structure

```
vikraman-blog/
├── client/
│   ├── public/
│   │   └── screenshots/
│   │        ├── home.png
│   │        ├── dashboard.png
│   │        ├── addblog.png
│   │        └── listblog.png
│   ├── src/
│   │   ├── api/axiosInstance.ts
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── server/
    ├── src/
    │   ├── configs/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── utils/
    │   └── server.ts
    └── package.json
```

---

## 📸 Screenshots

### 🏠 Home Page

![Home](client/public/screenshots/home.png)

### 📊 Admin Dashboard

![Dashboard](client/public/screenshots/dashboard.png)

### ➕ Add Blog

![Add Blog](client/public/screenshots/addblog.png)

### 📚 Blog List

![Blog List](client/public/screenshots/listblog.png)

---

## 🔑 Environment Variables

### **Server (.env)**

```
PORT=3000
MONGODB_URI=your_mongodb_url

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_space

GROQ_API_KEY=your_groq_key
```

### **Client (.env)**

```
VITE_BASE_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Install Dependencies

#### Backend

```
cd server
pnpm install
pnpm dev
```

#### Frontend

```
cd client
pnpm install
pnpm dev
```

---

## 📡 API Documentation (Summary)

### Public Routes

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | /api/blog              | Get published blogs |
| GET    | /api/blog/:id          | Get blog            |
| POST   | /api/blog/:id/comment  | Add comment         |
| GET    | /api/blog/:id/comments | Get comments        |

### Admin Routes

| Method | Endpoint                       | Description     |
| ------ | ------------------------------ | --------------- |
| POST   | /api/admin/login               | Login           |
| GET    | /api/admin/dashboard           | Dashboard stats |
| GET    | /api/admin/blogs               | All blogs       |
| GET    | /api/admin/comments            | All comments    |
| POST   | /api/blog                      | Create blog     |
| PATCH  | /api/blog/:id/publish          | Publish toggle  |
| DELETE | /api/blog/:id                  | Delete          |
| PATCH  | /api/admin/comment/:id/approve | Approve         |
| DELETE | /api/admin/comment/:id         | Delete          |

---

## 🌐 Deployment

### Frontend (Vercel)

- Build command: `pnpm build`
- Output: `dist/`

### Backend (Vercel)

- Build: `pnpm build`
- Output: `dist/`

---

## 🤝 Contributing

Pull Requests are welcome!

---

## 📄 License

MIT License.

---

## 👤 Author

**Vikraman R**
GitHub: https://github.com/VIKRAMANR7

---

Made with ❤️
