# 📝 DevBlog — Full Stack Blog Platform

A modern full-stack blog platform built with React, Node.js, Express, and MongoDB.  
The platform includes secure JWT authentication, role-based access control, rich text editing, avatar uploads, article management, analytics dashboard, and a fully responsive UI.

🌐 **Live Demo:** Coming Soon  
📦 **Backend API:** Coming Soon

---

# ✨ Features

## 👤 Authentication & Users
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Avatar upload and update
- Public user profile pages
- Request editor role with profession details
- Protected private routes
- Persistent authentication using local storage

---

## 📝 Articles System
- Create, edit, and delete blog articles
- Rich text editor using React Quill
- Categories and tags support
- Search functionality
- Pagination system
- Likes and comments
- Article view counter
- Featured image uploads
- Responsive article pages

---

## 🛡️ Role-Based Access Control

| Role | Permissions |
|------|-------------|
| User | Read articles, comment, and request editor role |
| Editor | Create, edit, and delete their own articles |
| Admin | Full platform management access |

---

# ⚙️ Admin Dashboard
- Manage users and roles
- Approve or reject editor requests
- Ban or unban users
- Delete users or articles
- Analytics dashboard with charts
- Track user growth and article statistics
- Paginated management tables

---

# 🗂️ Project Structure

```bash
blog-api/
│
├── README.md
│
├── blog-backend/                 # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── docs/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
└── blog-frontend/                # React Frontend Application
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    │
    ├── .env.example
    ├── package.json
    └── package-lock.json
```

---

# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have installed:

- Node.js v18 or higher
- MongoDB Community Server or MongoDB Atlas
- Git

---

# 🔧 Backend Installation

```bash
cd blog-backend

npm install

cp .env.example .env
```

Fill your `.env` file with the required values.

Start the backend server:

```bash
npm run dev
```

Or:

```bash
node src/server.js
```

Backend server will run on:

```bash
http://localhost:5000
```

---

# 🎨 Frontend Installation

```bash
cd blog-frontend

npm install --legacy-peer-deps

cp .env.example .env
```

Start the frontend:

```bash
npm start
```

Frontend will run on:

```bash
http://localhost:3000
```

---

# 🔐 Environment Variables

## Backend (`blog-backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/devblog
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
```

---

## Frontend (`blog-frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
```

---

# 🛠️ Tech Stack

## Backend Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Bcrypt
- Helmet
- CORS
- Express Validator

---

## Frontend Technologies
- React 19
- React Router DOM v6
- Axios
- Bootstrap 5
- React Quill
- Recharts
- Context API

---

# 📡 REST API Endpoints

## 🔑 Authentication Routes

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/me` | Private |
| PUT | `/api/auth/me/avatar` | Private |
| GET | `/api/auth/users/:id` | Public |
| POST | `/api/auth/request-editor` | Private |

---

## 📝 Article Routes

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/articles` | Public |
| GET | `/api/articles/:id` | Public |
| POST | `/api/articles` | Editor/Admin |
| PUT | `/api/articles/:id` | Editor/Admin |
| DELETE | `/api/articles/:id` | Editor/Admin |

---

## ⚙️ Admin Routes

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/auth/admin/users` | Admin |
| PUT | `/api/auth/admin/users/:id/role` | Admin |
| PUT | `/api/auth/admin/users/:id/status` | Admin |
| DELETE | `/api/auth/admin/users/:id` | Admin |
| GET | `/api/auth/admin/editor-requests` | Admin |
| PUT | `/api/auth/admin/editor-requests/:id` | Admin |

---

# 📸 Screenshots

## Home Page

```bash
blog-frontend/public/screenshots/home.png
```

## Admin Dashboard

```bash
blog-frontend/public/screenshots/dashboard.png
```

## Article Editor

```bash
blog-frontend/public/screenshots/editor.png
```

---

# 🧪 Future Improvements
- Email verification
- Password reset system
- Dark mode
- Notifications system
- Bookmark articles
- Real-time chat
- Markdown editor support
- Docker deployment
- CI/CD pipeline

---

# 🚀 Deployment

## Frontend Deployment
You can deploy the frontend using:
- Vercel
- Netlify

## Backend Deployment
You can deploy the backend using:
- Render
- Railway
- VPS Server

## Database
Use:
- MongoDB Atlas

---

# 👨‍💻 Author

## Adem Berrabia

- GitHub: https://github.com/Adem-Berrabia

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project:
- Star the repository
- Fork the project
- Share it with others

---

# 📌 GitHub Repository Description

```text
Full stack blog platform — React + Node.js + MongoDB. Role-based authentication, rich text editor, avatar upload, analytics dashboard, and article management system.
```

---

# 📥 Push README to GitHub

```bash
git add README.md

git commit -m "docs: add professional README"

git push
```
