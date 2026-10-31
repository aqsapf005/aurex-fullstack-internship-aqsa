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


---

## Live demo
https://aurex-week1-task-manager-ten.vercel.app

## Learning summary
I built the Task Manager again in React instead of plain JavaScript. I learned to split the page into components (Header, TaskForm, TaskList, TaskItem), pass data down with props and send events up with function props. I used useState for the task list and a controlled input for the form, and added validation (required, 3 to 100 characters, no duplicates). I also saved the tasks in localStorage so they stay after a refresh.

## Challenges
When I ran npm run dev, Vite said port 5173 was in use and moved to 5174. I learned that another dev server was already running on that port, and each project can run on its own port.