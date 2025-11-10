# 📝 Vikraman Blog — Full-Stack Blogging Platform (TypeScript MERN)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2024.8.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green)](https://www.mongodb.com/)

> A modern full-stack **TypeScript blogging platform** with admin dashboard, ImageKit CDN integration, AI-powered content generation (via Groq), and secure JWT-based admin authentication. Built with **React + Vite + TailwindCSS + Express + MongoDB**.

---

## ✨ Features

### 🧠 AI-Powered Blog Creation

- **Groq AI Integration** – Generate blog content automatically from short prompts.
- **Markdown-to-HTML** processing for rich blog formatting.
- **Auto-enrichment** – Ensures generated blogs include headings, lists, and links.

### 📰 Blog Management

- Full **CRUD** on blogs.
- **Publish / Unpublish** toggling.
- **Categories** (Technology, Startup, Lifestyle, Finance).
- **Search and Filter** in frontend.
- **Image Upload** via ImageKit (optimized, CDN-served).

### 💬 Comment System

- Users can comment on blogs.
- Comments are **pending approval** by default.
- Admin can **approve / delete** comments from the dashboard.

### 🔐 Secure Admin Authentication

- Single-admin system (credentials stored in `.env`).
- **JWT** with 1-hour expiry.
- **Protected routes** via middleware.
- Auto-logout on expired or invalid token.

### 📊 Admin Dashboard

- Stats: total blogs, comments, drafts.
- View recent blogs and quick actions.
- Comment moderation interface.

### 🎨 Modern UI/UX

- **React 19 + Vite + Tailwind CSS 4**.
- Smooth animations with **motion/react**.
- Responsive, mobile-first design.
- Toast notifications via **react-hot-toast**.
- Optimized typography and layout.

---

## 🧰 Tech Stack

### Frontend

- React 19 (TypeScript)
- Vite 6
- Tailwind CSS 4
- React Router DOM 7
- Axios
- Motion (for animations)
- Moment.js
- React Hot Toast

### Backend

- Node.js (>= 24.8)
- Express 5 (TypeScript)
- MongoDB + Mongoose 8
- JWT Authentication
- Multer (for file uploads)
- ImageKit SDK
- Groq SDK (AI completions)
- CORS, dotenv, tsx, nodemon

---

## 📂️ Folder Structure

```
vikramanblog/
├── client/
│   ├── src/
│   │   ├── assets/              # Icons, images, constants
│   │   ├── components/          # UI + admin components
│   │   ├── context/             # AppContext.tsx (global state)
│   │   ├── pages/               # Home, Blog, Admin pages
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── server/
│   ├── src/
│   │   ├── controllers/         # adminController.ts, blogController.ts
│   │   ├── configs/             # db.ts, groq.ts, imageKit.ts
│   │   ├── middleware/          # auth.ts, multer.ts
│   │   ├── models/              # Blog.ts, Comment.ts
│   │   ├── routes/              # adminRoutes.ts, blogRoutes.ts
│   │   ├── types/               # express.d.ts (type augmentation)
│   │   └── server.ts            # entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Setup

### Server (`server/.env`)

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_strong_password
JWT_SECRET=your_jwt_secret_64chars

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### Client (`client/.env`)

```env
VITE_BASE_URL=http://localhost:3000
```

---

## 🚀 Run Locally

### Prerequisites

- Node.js ≥ 24.8.0
- MongoDB (local or Atlas)
- ImageKit account
- Groq API key

### 1️⃣ Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2️⃣ Run Development Servers

```bash
# Terminal 1 (backend)
cd server
npm run dev   # tsx watch src/server.ts

# Terminal 2 (frontend)
cd client
npm run dev   # vite dev server
```

### 3️⃣ Access

- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:3000](http://localhost:3000)
- Admin Panel → [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🧩 API Reference

### Public Routes

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| `GET`  | `/api/blog`              | Get all published blogs          |
| `GET`  | `/api/blog/:id`          | Get a single blog by ID          |
| `GET`  | `/api/blog/:id/comments` | Get approved comments for a blog |
| `POST` | `/api/blog/:id/comment`  | Submit a new comment             |

### Admin Routes (JWT Required)

| Method   | Endpoint                         | Description                         |
| -------- | -------------------------------- | ----------------------------------- |
| `POST`   | `/api/admin/login`               | Login with admin credentials        |
| `GET`    | `/api/admin/dashboard`           | Dashboard stats & latest blogs      |
| `GET`    | `/api/admin/blogs`               | List all blogs (including drafts)   |
| `GET`    | `/api/admin/comments`            | Get all comments                    |
| `PATCH`  | `/api/admin/comment/:id/approve` | Approve a comment                   |
| `DELETE` | `/api/admin/comment/:id`         | Delete a comment                    |
| `POST`   | `/api/blog`                      | Create a new blog with image upload |
| `DELETE` | `/api/blog/:id`                  | Delete a blog                       |
| `PATCH`  | `/api/blog/:id/publish`          | Toggle publish/unpublish            |
| `POST`   | `/api/blog/generate`             | Generate content via AI             |

---

## 🔐 Authentication Flow

1. Admin logs in with email/password (from `.env`).
2. Backend validates credentials → generates JWT.
3. Token stored in browser `localStorage`.
4. Axios sets `Authorization` header for all requests.
5. Middleware verifies token; rejects expired/invalid ones.
6. On 401, frontend logs out automatically.

---

## 🧠 AI & Image Upload Flow

### AI Content (Groq)

1. Admin enters prompt → `/api/blog/generate`.
2. Server calls `groq.chat.completions.create`.
3. Markdown result sanitized to ensure full article structure.
4. Returned HTML rendered in frontend.

### Image Upload (ImageKit)

1. Admin uploads image via form (Multer middleware).
2. Uploaded to ImageKit using credentials from `.env`.
3. URL stored in `Blog.image`.
4. Served via CDN automatically optimized.

---

## 🗾 Scripts

### Client

| Script      | Description                 |
| ----------- | --------------------------- |
| `dev`       | Start Vite dev server       |
| `build`     | Type check + build frontend |
| `preview`   | Preview built app           |
| `lint`      | Run ESLint                  |
| `typecheck` | TypeScript type checking    |

### Server

| Script   | Description                     |
| -------- | ------------------------------- |
| `dev`    | Start dev server with tsx watch |
| `build`  | Compile TypeScript to `dist`    |
| `start`  | Run production build            |
| `lint`   | Run ESLint                      |
| `format` | Prettier formatting             |

---

## 🔒 Security Checklist

- [x] Strong JWT secret (64+ chars)
- [x] HTTPS in production
- [x] `.env` files ignored in `.gitignore`
- [x] CORS restricted to frontend domain
- [x] MongoDB Atlas IP whitelist
- [x] Token expires after 1 hour
- [x] Auto-logout on invalid token
- [x] Single-admin architecture for simplicity

---

## 🌍 Deployment (Vercel)

### Backend

```bash
cd server
npm run build
vercel --prod
```

### Frontend

```bash
cd client
npm run build
vercel --prod
```

**Set environment variables** in Vercel dashboard (for both projects) using the same keys as `.env`.

Example:

```
VITE_BASE_URL=https://your-server.vercel.app
```

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create a feature branch
3. `npm run lint` and `npm run typecheck` before committing
4. Push and open a PR 🎉

---

## 📜 License

ISC License — see [LICENSE](LICENSE)

---

⭐ **If you found this helpful, consider giving it a star!**
