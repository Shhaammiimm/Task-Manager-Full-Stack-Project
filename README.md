# Task Manager - Full Stack Todo List Application

A full-stack todo list app with **React** frontend and **Express** backend: user auth, task management with priority & due dates, dark mode, search, and sort.

## Project structure

```
Task-Manager-Full-Stack-Project/
├── backend/                 # Express API
│   ├── app.js               # Server entry
│   ├── routes/api.js        # API routes
│   ├── app/
│   │   ├── config/          # Config (port, DB, JWT)
│   │   ├── controller/     # Task & user controllers
│   │   ├── middlewares/     # Auth middleware
│   │   ├── model/          # Mongoose models
│   │   └── utility/        # Token, email
│   ├── .env.example
│   └── package.json
├── frontend/                 # React (Vite)
│   ├── index.html           # Entry HTML (kept as requested)
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/client.js    # API client
│   │   ├── context/         # Auth, Toast, Theme
│   │   └── components/      # Navbar, Auth, Dashboard, Tasks, Modals
│   ├── public/
│   └── package.json
├── package.json              # Root scripts (dev, build)
├── start.bat / start.sh
└── README.md
```

## Features

### Backend
- User auth: register, login, forgot/reset password (email OTP)
- Profile: get/update
- Tasks: create, update, delete, filter by status, count
- Task fields: title, description, status, **priority** (low/medium/high), **due date** (optional)
- JWT, rate limit, CORS, Helmet

### Frontend (React)
- **Auth**: Login, Register, Forgot password, Reset password
- **Dashboard**: Stats (total, pending, completed, cancelled)
- **Tasks**: List with **search**, **sort** (date, title, status, priority, due date), **filter** (all/pending/completed/cancelled)
- **Add/Edit task**: Title, description, status, priority, due date
- **Profile** modal
- **Dark mode** toggle (navbar + login page)
- **Dynamic UI**: Animations, toasts, loading states, responsive layout

## Tech stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer, Helmet, CORS, express-rate-limit
- **Frontend**: React 18, Vite, Tailwind CSS (CDN), context (Auth, Toast, Theme)

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone <repo-url>
cd Task-Manager-Full-Stack-Project
```

### 2. Backend

```bash
cd backend
npm install
```

Copy env and edit as needed:

```bash
cp .env.example .env
```

`.env` (optional overrides; defaults in `app/config/config.js`):

```env
PORT=5000
DATABASE=mongodb://127.0.0.1:27017/taskmanager
JWT_KEY=YourJWTSecretKey
JWT_EXPIRE_TIME=30d
# Optional: for forgot-password email
# EMAIL_HOST=...
# EMAIL_PORT=...
# EMAIL_USER=...
# EMAIL_PASS=...
```

Start backend:

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` to `http://localhost:5000`.

### 4. Run both from root (optional)

```bash
npm install
npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:5173  

Or use `start.bat` (Windows) / `start.sh` (Linux/Mac) to start both.

## Build for production

```bash
cd frontend
npm run build
```

Output is in `frontend/dist`. Serve that folder (e.g. static host or GitHub Pages). Point the frontend API base to your deployed backend (e.g. set `VITE_API_BASE` and use it in `src/api/client.js` if you add env support).

## API (summary)

- **Auth**: `POST /api/Registration`, `POST /api/Login`, `GET /api/EmailVerify/:email`, `POST /api/ResetPassword`
- **Profile**: `GET /api/ProfileDetails`, `PUT /api/ProfileUpdate` (Bearer token)
- **Tasks**: `POST /api/CreateTask`, `PUT /api/UpdateTask/:id`, `PATCH /api/UpdateTaskStatus/:id/:status`, `GET /api/TaskListByStatus/:status`, `DELETE /api/DeleteTask/:id`, `GET /api/CountTask` (Bearer token)

Task body can include: `title`, `description`, `status`, `priority` (low/medium/high), `dueDate` (ISO date string, optional).

## License

ISC.
