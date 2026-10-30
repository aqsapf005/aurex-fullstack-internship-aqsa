# Week 2 — API-Based Employee Dashboard

A React application that loads employee data from a public REST API instead of hard-coded data.

## API used
**JSONPlaceholder** — `https://jsonplaceholder.typicode.com/users`

> JSONPlaceholder is a *fake* API. It accepts POST / PUT / DELETE and returns a success response, but it does **not** save anything. Only users with id 1–10 exist on the server, so for employees you add yourself (id > 10) the app updates the screen without calling the API (otherwise the server would answer with an error). A page refresh resets everything.

## Implemented API operations
| Operation | HTTP request | Where |
| --- | --- | --- |
| Read all employees | `GET /users` | `useEffect` in `App.jsx` |
| Add employee | `POST /users` | `UserForm` → `handleSave` |
| Update employee | `PUT /users/:id` | `UserForm` (edit mode) → `handleSave` |
| Delete employee | `DELETE /users/:id` | `UserCard` → `handleDelete` |

All requests are in `src/api/usersApi.js`.

## Features
- Display records from the API
- Search (name / email / company) and filter (city)
- View details (modal)
- Add, update, delete
- Loading state, error state (with Retry button), empty state
- Navigation (Dashboard / Add Employee)
- Responsive layout
- Reusable components

## Components
```
App (state + API calls)
 ├── Navbar
 ├── SearchFilter
 ├── UserList
 │    └── UserCard
 ├── UserDetails (modal)
 ├── UserForm (add + edit)
 ├── Loader
 └── ErrorMessage
```

## Data flow
`Frontend → API request (fetch) → Server → JSON response → React state (setUsers) → UI re-renders`

## State management
State lives in `App` and is passed down with props ("lifting state up"). Search/filter results are *derived* from state with `useMemo` instead of being stored separately.

## Run locally
```bash
npm install
npm run dev
```

## Live demo / Screenshots / Learning summary
<!-- Add your deployment link, screenshots and your own learning summary -->
