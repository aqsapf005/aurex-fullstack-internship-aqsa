# Week 1 — React Task Manager (Part 1)

A component-based Task Manager built with **React + Vite**. It is the React version of the Month 1 (vanilla JavaScript) Task Manager.

## Features
- Add a task
- Display all tasks
- Mark a task as completed / not completed
- Delete a task
- Input validation (required, 3–100 characters, no duplicates) with error message
- Tasks are saved in `localStorage`, so they survive a page refresh

## Technologies
React 19, Vite, JSX, props, `useState`, `useEffect` (only for saving to localStorage), CSS

## Component structure
```
App                  (holds the tasks state + all handler functions)
 ├── Header          (title + completed counter)
 ├── TaskForm        (controlled input + validation)
 └── TaskList
      └── TaskItem   (one task: checkbox + delete button)
```

## How data flows
- `App` owns the `tasks` state.
- Data goes **down** through props (`tasks`, `task`, `total`, `completed`).
- Events go **up** by calling functions passed as props (`onAddTask`, `onToggleTask`, `onDeleteTask`).
- When state changes, React re-renders the affected components.

## Run locally
```bash
npm install
npm run dev
```
Build for production: `npm run build`

## Live demo
<!-- Add your Vercel / Netlify link here -->

## Screenshots
<!-- Add screenshots here -->

## Learning summary
<!-- Write 4–5 lines in your own words about what you learned this week -->
