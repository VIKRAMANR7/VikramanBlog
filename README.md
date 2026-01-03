# Vikraman Blog

A full-stack blogging platform built with React, TypeScript, Node.js, Express, MongoDB, ImageKit, and GROQ AI. Features AI-powered blog generation, admin dashboard, JWT authentication, and comment moderation.

## Live Demo

- **Frontend:** [vikraman-blog.vercel.app](https://vikraman-blog.vercel.app)
- **Backend:** [vikraman-blog-server.vercel.app](https://vikraman-blog-server.vercel.app)

---

## Tech Stack

| Layer      | Technologies                                          |
| ---------- | ----------------------------------------------------- |
| Frontend   | React 19, TypeScript, Vite, TailwindCSS, React Router |
| Backend    | Node.js, Express 5, TypeScript, MongoDB, Mongoose     |
| Auth       | JWT (JSON Web Tokens)                                 |
| Storage    | ImageKit CDN (image optimization & delivery)          |
| AI         | GROQ API with Llama 3.3 70B                           |
| Deployment | Vercel (frontend & backend)                           |

---

## Features

- **AI-Powered Content Generation** — Generate blog articles using GROQ Llama 3.3
- **Image Upload & Optimization** — Automatic WebP conversion and CDN delivery via ImageKit
- **Markdown Support** — Write in Markdown, render as HTML
- **Category Filtering & Search** — Filter blogs by category or search by title
- **Comment System** — User comments with admin approval workflow
- **Admin Dashboard** — Manage blogs, comments, and view statistics
- **JWT Authentication** — Secure admin routes with token-based auth
- **Publish/Draft Workflow** — Save drafts and publish when ready
- **Responsive Design** — Mobile-first design with TailwindCSS

---

## Screenshots

| Home Page                                   | Admin Dashboard                                       |
| ------------------------------------------- | ----------------------------------------------------- |
| ![Home](client/public/screenshots/home.png) | ![Dashboard](client/public/screenshots/dashboard.png) |

| Add Blog                                           | Blog List                                            |
| -------------------------------------------------- | ---------------------------------------------------- |
| ![Add Blog](client/public/screenshots/addblog.png) | ![Blog List](client/public/screenshots/listblog.png) |

---

## Architecture & Diagrams

### System Architecture

```mermaid
flowchart TB
    subgraph Client["Client (React + Vite)"]
        UI[UI Components]
        Context[Context API]
        Router[React Router]
    end

    subgraph Server["Server (Express + TypeScript)"]
        API[REST API]
        AuthMW[Auth Middleware]
        Controllers[Controllers]
        Models[Mongoose Models]
    end

    subgraph External["External Services"]
        ImageKit[(ImageKit CDN)]
        GROQ[(GROQ AI)]
    end

    subgraph Database["Database"]
        MongoDB[(MongoDB Atlas)]
    end

    UI --> Context
    Context --> Router
    Router -->|HTTP Requests| API
    API --> AuthMW
    AuthMW --> Controllers
    Controllers --> Models
    Models --> MongoDB
    Controllers -->|Image Upload| ImageKit
    Controllers -->|AI Generation| GROQ
```

### Database Schema (ERD)

```mermaid
erDiagram
    BLOG {
        ObjectId _id PK
        String title
        String subtitle
        String description
        String category
        String image
        Boolean isPublished
        Date createdAt
        Date updatedAt
    }

    COMMENT {
        ObjectId _id PK
        ObjectId blog FK
        String name
        String content
        Boolean isApproved
        Date createdAt
        Date updatedAt
    }

    BLOG ||--o{ COMMENT : "has many"
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Client
    participant API
    participant JWT

    Admin->>Client: Enter email & password
    Client->>API: POST /api/admin/login
    API->>API: Validate credentials

    alt Invalid Credentials
        API-->>Client: 401 Unauthorized
        Client-->>Admin: Show error
    else Valid Credentials
        API->>JWT: Sign token (1h expiry)
        JWT-->>API: Token
        API-->>Client: { success: true, token }
        Client->>Client: Store token in localStorage
        Client->>Client: Set Authorization header
        Client-->>Admin: Redirect to Dashboard
    end

    Note over Client,API: Subsequent Requests

    Client->>API: Request with Bearer token
    API->>JWT: Verify token

    alt Token Expired
        JWT-->>API: TokenExpiredError
        API-->>Client: 401 Token expired
        Client->>Client: Clear token & logout
        Client-->>Admin: Redirect to Login
    else Token Valid
        JWT-->>API: Decoded payload
        API->>API: Process request
        API-->>Client: Response
    end
```

### Blog Creation Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Client
    participant API
    participant ImageKit
    participant MongoDB

    Admin->>Client: Fill form + upload image
    Client->>Client: Validate form fields
    Client->>Client: Convert Markdown to HTML

    Client->>API: POST /api/blog (FormData)
    API->>API: Verify JWT token

    alt Unauthorized
        API-->>Client: 401 Unauthorized
    else Authorized
        API->>API: Parse blog data from FormData
        API->>API: Read image file buffer
        API->>ImageKit: Upload image
        ImageKit->>ImageKit: Optimize (WebP, quality:auto)
        ImageKit-->>API: Optimized image URL
        API->>API: Delete temp file
        API->>MongoDB: Create blog document
        MongoDB-->>API: Saved blog
        API-->>Client: { success: true }
        Client-->>Admin: Show success toast
    end
```

### AI Content Generation Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Client
    participant API
    participant GROQ

    Admin->>Client: Enter blog title/prompt
    Client->>API: POST /api/blog/generate
    API->>API: Verify JWT token
    API->>API: Build system + user prompt
    API->>GROQ: Chat completion request

    Note over GROQ: Model: llama-3.3-70b-versatile<br/>Temperature: 0.6<br/>Max tokens: 2500

    GROQ-->>API: Generated markdown
    API->>API: Fix markdown (add headers, lists, links)
    API-->>Client: { success: true, content }
    Client->>Client: Prefill description textarea
    Client-->>Admin: Ready to edit/publish
```

### Comment Moderation Flow

```mermaid
sequenceDiagram
    participant User
    participant Admin
    participant Client
    participant API
    participant MongoDB

    Note over User,MongoDB: User Submits Comment

    User->>Client: Write comment (name + content)
    Client->>API: POST /api/blog/:id/comment
    API->>MongoDB: Save comment (isApproved: false)
    API-->>Client: { success: true, message: "Pending approval" }
    Client-->>User: Show success message

    Note over User,MongoDB: Admin Moderates Comment

    Admin->>Client: View pending comments
    Client->>API: GET /api/admin/comments
    API->>MongoDB: Fetch all comments (populated with blog)
    API-->>Client: Comments list

    alt Approve Comment
        Admin->>Client: Click approve
        Client->>API: PATCH /api/admin/comment/:id/approve
        API->>MongoDB: Update isApproved = true
        API-->>Client: Success
    else Delete Comment
        Admin->>Client: Click delete
        Client->>API: DELETE /api/admin/comment/:id
        API->>MongoDB: Remove comment
        API-->>Client: Success
    end
```

### Frontend Component Hierarchy

```mermaid
flowchart TB
    subgraph App["App.tsx"]
        Router[React Router]
    end

    subgraph Public["Public Pages"]
        Home[Home]
        BlogPage[Blog/:id]
    end

    subgraph Admin["Admin Pages (Protected)"]
        Layout[Layout]
        Dashboard[Dashboard]
        AddBlog[AddBlog]
        BlogListAdmin[BlogListAdmin]
        Comments[Comments]
    end

    subgraph Components["Shared Components"]
        Navbar[Navbar]
        Header[Header]
        BlogList[BlogList]
        BlogCard[BlogCard]
        Footer[Footer]
        Loader[Loader]
    end

    subgraph AdminComponents["Admin Components"]
        Sidebar[Sidebar]
        BlogTableItem[BlogTableItem]
        CommentTableItem[CommentTableItem]
        Login[Login]
    end

    Router --> Home
    Router --> BlogPage
    Router --> Layout
    Router --> Login

    Home --> Navbar
    Home --> Header
    Home --> BlogList
    Home --> Footer
    BlogList --> BlogCard

    BlogPage --> Navbar
    BlogPage --> Footer
    BlogPage --> Loader

    Layout --> Sidebar
    Layout --> Dashboard
    Layout --> AddBlog
    Layout --> BlogListAdmin
    Layout --> Comments

    Dashboard --> BlogTableItem
    BlogListAdmin --> BlogTableItem
    Comments --> CommentTableItem
```

### State Management (Context API)

```mermaid
flowchart TB
    subgraph AppProvider["AppProvider (Context)"]
        State["State:
        • token (auth)
        • blogs (data)
        • input (search)"]

        Actions["Actions:
        • saveToken()
        • handleLogout()
        • fetchBlogs()
        • setInput()"]
    end

    subgraph Consumers["Consumer Components"]
        App[App.tsx]
        Navbar[Navbar]
        Header[Header]
        BlogList[BlogList]
        Login[Login]
        Layout[Layout]
    end

    AppProvider --> App
    App --> Navbar
    App --> Header
    App --> BlogList
    App --> Login
    App --> Layout

    Navbar -->|reads| State
    Header -->|reads/writes| State
    BlogList -->|reads| State
    Login -->|writes| State
    Layout -->|reads| State
```

---

## API Reference

### Public Endpoints

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/blog`                  | Get all published blogs |
| GET    | `/api/blog/:blogId`          | Get single blog by ID   |
| POST   | `/api/blog/:blogId/comment`  | Add comment to blog     |
| GET    | `/api/blog/:blogId/comments` | Get approved comments   |

### Protected Endpoints (Requires JWT)

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| POST   | `/api/admin/login`               | Admin login                 |
| GET    | `/api/admin/dashboard`           | Get dashboard statistics    |
| GET    | `/api/admin/blogs`               | Get all blogs (inc. drafts) |
| GET    | `/api/admin/comments`            | Get all comments            |
| POST   | `/api/blog`                      | Create new blog             |
| DELETE | `/api/blog/:blogId`              | Delete blog                 |
| PATCH  | `/api/blog/:blogId/publish`      | Toggle publish status       |
| POST   | `/api/blog/generate`             | Generate AI content         |
| PATCH  | `/api/admin/comment/:id/approve` | Approve comment             |
| DELETE | `/api/admin/comment/:id`         | Delete comment              |

---

## Project Structure

```
vikraman-blog/
├── client/                     # React frontend
│   ├── public/
│   │   └── screenshots/        # App screenshots
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.ts    # Axios config with auth interceptor
│   │   ├── assets/
│   │   │   └── assets.ts           # Static assets & constants
│   │   ├── components/
│   │   │   ├── admin/              # Admin-specific components
│   │   │   │   ├── BlogTableItem.tsx
│   │   │   │   ├── CommentTableItem.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── BlogList.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── NewsLetter.tsx
│   │   ├── context/
│   │   │   ├── AppContext.ts       # Context definition
│   │   │   ├── AppProvider.tsx     # Context provider with state
│   │   │   └── useAppContext.ts    # Custom hook for context
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AddBlog.tsx
│   │   │   │   ├── BlogListAdmin.tsx
│   │   │   │   ├── Comments.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── Blog.tsx
│   │   │   └── Home.tsx
│   │   ├── types/
│   │   │   ├── blog.ts             # Blog interface
│   │   │   └── comment.ts          # Comment interface
│   │   ├── App.tsx                 # Root component with routes
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── server/                     # Express backend
    ├── src/
    │   ├── configs/
    │   │   ├── db.ts               # MongoDB connection
    │   │   ├── groq.ts             # GROQ AI client
    │   │   ├── imageKit.ts         # ImageKit client
    │   │   └── validateEnv.ts      # Environment validation
    │   ├── controllers/
    │   │   ├── adminController.ts  # Admin route handlers
    │   │   └── blogController.ts   # Blog route handlers
    │   ├── middleware/
    │   │   ├── auth.ts             # JWT verification
    │   │   └── multer.ts           # File upload config
    │   ├── models/
    │   │   ├── Blog.ts             # Blog schema
    │   │   └── Comment.ts          # Comment schema
    │   ├── routes/
    │   │   ├── adminRoutes.ts      # Admin endpoints
    │   │   └── blogRoutes.ts       # Blog endpoints
    │   ├── types/
    │   │   └── express.d.ts        # Express type augmentation
    │   ├── utils/
    │   │   ├── buildBlogPrompt.ts  # AI prompt builder
    │   │   ├── fixMarkdown.ts      # Markdown cleanup
    │   │   └── sendError.ts        # Error response helper
    │   └── server.ts               # Express app entry
    └── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MongoDB Atlas account
- ImageKit account (free tier available)
- GROQ API key (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/VIKRAMANR7/vikraman-blog.git
cd vikraman-blog
```

### 2. Set Up Environment Variables

**Server (`server/.env`)**

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
GROQ_API_KEY=your_groq_api_key
```

**Client (`client/.env`)**

```env
VITE_BASE_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
pnpm install

# Install client dependencies
cd ../client
pnpm install
```

### 4. Run Development Servers

```bash
# Terminal 1: Start server
cd server
pnpm dev

# Terminal 2: Start client
cd client
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## What I Learned

This project helped me understand and implement:

### TypeScript Best Practices

- **Type inference** — Let TypeScript infer types instead of adding redundant annotations
- **Function declarations** — Use `function` instead of arrow functions for components and handlers
- **Interface vs Type** — Use `interface` for objects, `type` for unions
- **Generics** — Only use when TypeScript can't infer (null, empty arrays)

### React Patterns

- **Context API** — Global state management without Redux
- **Custom hooks** — `useAppContext()` for type-safe context access
- **useCallback** — Only in Context Providers where functions are passed to multiple consumers
- **Conditional rendering** — Early returns for loading/error states

### Backend Architecture

- **MVC pattern** — Separation of routes, controllers, and models
- **Middleware** — JWT authentication, file upload handling
- **Error handling** — Centralized error responses with proper status codes
- **Environment validation** — Fail fast if required env vars are missing

### Security

- **JWT authentication** — Token-based auth with expiry handling
- **Protected routes** — Middleware to guard admin endpoints
- **Input validation** — Server-side validation for all inputs
- **CORS configuration** — Restricted origins for API access

---

## Author

**Vikraman R** — [GitHub](https://github.com/VIKRAMANR7)

---

## License

This project is open source and available under the [MIT License](LICENSE).
