# Vikraman Blog

A full-stack blogging platform built with React, TypeScript, Node.js, Express, MongoDB, ImageKit, and GROQ AI. Features AI-powered blog generation, admin dashboard, JWT authentication, and comment moderation.

## Live Demo

- **Frontend:** https://vikraman-blog.vercel.app
- **Backend:** https://vikraman-blog-server.vercel.app

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, React Router, Axios, Motion, Marked

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, ImageKit, GROQ AI, JWT, Multer

## Features

- AI-powered article generation using GROQ Llama 3.3
- Image upload with CDN optimization via ImageKit
- Markdown to HTML rendering
- Category filtering and search
- Comment system with admin approval
- JWT-based admin authentication
- Publish/unpublish workflow
- Responsive design

## System Architecture

```mermaid
flowchart TB
    subgraph Client
        React[React + TypeScript]
        Vite[Vite]
    end

    subgraph Server
        Express[Express API]
        Auth[JWT Auth]
        Controllers[Controllers]
    end

    subgraph Database
        MongoDB[(MongoDB)]
    end

    subgraph External
        ImageKit[ImageKit CDN]
        GROQ[GROQ AI]
    end

    React --> Express
    Express --> Auth
    Auth --> Controllers
    Controllers --> MongoDB
    Controllers --> ImageKit
    Controllers --> GROQ
```

## Data Flow

### Blog Creation

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant ImageKit
    participant MongoDB

    User->>Client: Fill form + upload image
    Client->>API: POST /api/blog
    API->>API: Validate JWT
    API->>ImageKit: Upload image
    ImageKit-->>API: Image URL
    API->>MongoDB: Save blog
    MongoDB-->>API: Saved
    API-->>Client: Success
    Client-->>User: Redirect to dashboard
```

### AI Content Generation

```mermaid
sequenceDiagram
    participant Admin
    participant Client
    participant API
    participant GROQ

    Admin->>Client: Enter prompt
    Client->>API: POST /api/blog/generate
    API->>API: Validate JWT
    API->>GROQ: Send prompt
    GROQ-->>API: Markdown content
    API->>API: Clean markdown
    API-->>Client: Generated content
    Client-->>Admin: Prefill editor
```

### Comment Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Admin
    participant Client
    participant API
    participant MongoDB

    User->>Client: Write comment
    Client->>API: POST /api/blog/:id/comment
    API->>MongoDB: Save (isApproved=false)
    API-->>Client: Pending approval

    Admin->>Client: View comments
    Client->>API: GET /api/admin/comments
    API->>MongoDB: Fetch comments
    API-->>Client: Comments list

    Admin->>Client: Approve comment
    Client->>API: PATCH /api/admin/comment/:id/approve
    API->>MongoDB: Update isApproved
    API-->>Client: Success
```

## API Endpoints

### Blog Routes

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| GET    | /api/blog              | Get all published blogs    |
| GET    | /api/blog/:id          | Get single blog            |
| POST   | /api/blog              | Create blog (auth)         |
| DELETE | /api/blog/:id          | Delete blog (auth)         |
| PATCH  | /api/blog/:id/publish  | Toggle publish (auth)      |
| POST   | /api/blog/:id/comment  | Add comment                |
| GET    | /api/blog/:id/comments | Get blog comments          |
| POST   | /api/blog/generate     | Generate AI content (auth) |

### Admin Routes

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | /api/admin/login               | Admin login            |
| GET    | /api/admin/dashboard           | Dashboard stats (auth) |
| GET    | /api/admin/blogs               | All blogs (auth)       |
| GET    | /api/admin/comments            | All comments (auth)    |
| PATCH  | /api/admin/comment/:id/approve | Approve comment (auth) |
| DELETE | /api/admin/comment/:id         | Delete comment (auth)  |

## Screenshots

### Home Page

![Home](client/public/screenshots/home.png)

### Admin Dashboard

![Dashboard](client/public/screenshots/dashboard.png)

### Add Blog

![Add Blog](client/public/screenshots/addblog.png)

### Blog List

![Blog List](client/public/screenshots/listblog.png)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB database
- ImageKit account
- GROQ API key

### Environment Variables

**Server (.env)**

```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_space
GROQ_API_KEY=your_groq_key
```

**Client (.env)**

```
VITE_BASE_URL=http://localhost:3000
```

### Installation

```bash
git clone https://github.com/VIKRAMANR7/vikraman-blog.git
cd vikraman-blog

cd server && pnpm install
cd ../client && pnpm install
```

### Run Development

```bash
cd server && pnpm dev
cd client && pnpm dev
```

## Project Structure

```
vikraman-blog/
├── client/
│   ├── public/
│   │   └── screenshots/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── admin/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── server/
    ├── src/
    │   ├── configs/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── types/
    │   ├── utils/
    │   └── server.ts
    └── tsconfig.json
```

## Author

**Vikraman R** - [GitHub](https://github.com/VIKRAMANR7)
