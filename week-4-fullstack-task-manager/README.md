# Week 4 — Authenticated Full-Stack Task Management System

A small full-stack app: users register / log in, and manage **their own** tasks.

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 4 |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT + bcrypt (`bcryptjs`) |

```
React Frontend  ──HTTP/JSON──▶  Express API  ──▶  MongoDB
                                 ├─ /api/auth   (register, login, me)
                                 └─ /api/tasks  (protected CRUD)
```

## Features
**Authentication:** register, login, logout, form validation, password hashing, JWT.
**Tasks:** add, view, edit, delete, mark complete, filter (status + priority).
**Data isolation:** every task stores its owner (`user`). All task queries include the logged-in user's id, so User A can never read, edit or delete User B's tasks (the API answers `404`).

## Run locally

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in MONGODB_URI and a long random JWT_SECRET
npm run dev               # http://localhost:5000
```
Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### 2. Frontend (second terminal)
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

## API documentation
Base URL: `/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description | Success | Errors |
| --- | --- | --- | --- | --- | --- |
| POST | `/auth/register` | no | `{name,email,password}` → `{token,user}` | 201 | 400, 409 duplicate email |
| POST | `/auth/login` | no | `{email,password}` → `{token,user}` | 200 | 400, 401 |
| GET | `/auth/me` | yes | current user | 200 | 401 |
| GET | `/tasks?status=&priority=` | yes | own tasks (`status`: all/pending/completed, `priority`: all/low/medium/high) | 200 | 400, 401 |
| POST | `/tasks` | yes | `{title, description?, priority?}` | 201 | 400, 401 |
| GET | `/tasks/:id` | yes | one own task | 200 | 400, 401, 404 |
| PUT | `/tasks/:id` | yes | update fields (`{"completed":true}` marks complete) | 200 | 400, 401, 404 |
| DELETE | `/tasks/:id` | yes | delete own task | 200 | 400, 401, 404 |

## Database models
**User:** `name`, `email` (unique, lowercase), `password` (bcrypt hash, `select:false`), timestamps.
**Task:** `user` (ObjectId → User, required), `title` (3–100), `description` (≤500), `completed` (Boolean), `priority` (low/medium/high), timestamps.
Relationship: one User → many Tasks.

## Authentication explanation
1. **Register:** server validates input → hashes the password with bcrypt (10 salt rounds) → saves the user → returns a JWT.
2. **Login:** finds the user by email → `bcrypt.compare(plain, hash)` → returns a JWT. Wrong email and wrong password give the *same* message so attackers cannot discover which emails exist.
3. **JWT:** signed with `JWT_SECRET`, contains only the user id, expires after `JWT_EXPIRES_IN` (7d).
4. **Protected routes:** the `protect` middleware reads the `Bearer` token, verifies it, loads the user into `req.user`, or answers `401` (missing / invalid / expired).
5. **React:** on login the token is saved in `localStorage` and attached to every request by `src/api/client.js`. `AuthContext` keeps the logged-in user; on refresh it calls `/auth/me` to restore the session; any `401` logs the user out. Logout = delete the token.

> Token storage note: `localStorage` is simple but readable by any script on the page (XSS). Production apps often use httpOnly cookies. This is listed under *Known limitations*.

## Testing
Automated API tests (needs the server running): `cd backend && npm run test:api`
It covers every case from the roadmap: successful / duplicate registration, correct / incorrect / invalid login, no token / valid token / invalid / expired token, full CRUD + complete + filters, and **data isolation** between two users. Also import `backend/postman_collection.json` into Postman and run it.
Logout and the UI are tested manually — see `TESTING.md` for the checklist. Paste your own results/screenshots there for the submission.

## Deployment
| Layer | Platform | Notes |
| --- | --- | --- |
| Database | MongoDB Atlas | Network Access must allow your host (e.g. `0.0.0.0/0` for Render) |
| Backend | Render / Railway | Root dir `backend`, build `npm install`, start `npm start`. Env vars: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (= your Vercel URL, no trailing slash) |
| Frontend | Vercel | Root dir `frontend`, framework Vite. Env var: `VITE_API_URL` = `https://<your-backend>.onrender.com/api` |

Deploy order: Atlas → backend → frontend → then set `CLIENT_URL` on the backend to the final frontend URL.

## Known limitations
- Token stored in `localStorage` (see note above).
- No password reset / email verification / refresh tokens.
- No pagination on tasks.
- No route library: the UI switches between pages with React state.

## Live links, screenshots, challenges, what I learned
<!-- Fill these in with your own words and links -->
