# Understanding guide (for mentor review)

AUREX says you must be able to **explain** your code. Read this, then open the files and trace each flow yourself. Re-write the explanations in your own words.

## Week 1 — React basics
**Why were components created?** Each has one job: `Header` shows the counter, `TaskForm` collects input, `TaskList` shows the list, `TaskItem` is one row. Small pieces are reusable and easier to read.
**Where is state stored?** In `App` (`tasks`). `TaskForm` also has its own small state for the input text and the error, because only the form needs it.
**How does data move?** Down with props (`tasks`, `task`), up with function props (`onAddTask`, `onToggleTask`, `onDeleteTask`).
**How do events update the UI?** Click → handler → `setTasks(...)` → React re-renders `App` and its children with the new list.
**Controlled input:** the input's `value` comes from state and `onChange` updates it, so React always knows the current text.
**Why `key`?** It lets React match list items between renders (we use the task `id`).

## Week 2 — APIs
**Flow:** `Frontend → fetch → Server → JSON → setUsers → UI`.
**Why `useEffect`?** Fetching data is a side effect; the empty/`reloadKey` dependency makes it run on load and on Retry. The `ignore` flag stops a late response from updating an unmounted component.
**Why check `response.ok`?** `fetch` only rejects on network failure — a 404/500 still "succeeds", so we throw ourselves.
**Loading / error / empty states:** three booleans/values (`loading`, `error`, `users.length === 0`) decide what is rendered.
**Why `useMemo` for search?** Visible users are *derived* from `users + search + city`; we don't store a second copy.
**Why does a new employee disappear on refresh?** JSONPlaceholder is a fake API: it doesn't save data.

## Week 3 — Backend
**Request flow:** Client → route (`/api/tasks/:id`) → controller → Mongoose model → MongoDB → JSON response.
**Middleware:** functions that run in order for each request (`cors`, `express.json`, routes, `notFound`, `errorHandler`). The error handler must be last.
**Schema vs Model:** schema = fields and rules; model = the object you call `find`, `create`, `findByIdAndUpdate` on.
**Status codes:** 201 created, 200 ok, 400 bad input/invalid id, 404 not found, 409 conflict, 500 server error.
**Why `.env`?** Secrets (DB password) must never be in Git. `.env` is ignored; `.env.example` shows the names only.
**`runValidators: true`:** without it, updates skip the schema rules.

## Week 4 — Authentication
**Why hash passwords?** If the database leaks, plain passwords would be exposed. bcrypt is a one-way, slow, salted hash; we can only *compare*, never decrypt.
**What is a JWT?** A signed token `header.payload.signature`. The server can verify it was issued by itself without storing sessions. Anyone can *read* the payload, so never put secrets in it.
**How does `protect` work?** Read `Authorization: Bearer <token>` → `jwt.verify` → load user → `req.user` → `next()`. Otherwise 401.
**How is data isolated?** Every Task has `user`; every query is `{ _id, user: req.user._id }`. Someone else's task is simply "not found".
**Why `select: false` on password?** So the hash is never returned by accident.
**React auth flow:** `AuthContext` holds `user`; `App` renders `Dashboard` only if `user` exists; `client.js` adds the token; a 401 triggers logout; on page load `/auth/me` restores the session.
**Authentication vs authorization:** authentication = who are you (login); authorization = what may you access (only your own tasks).
