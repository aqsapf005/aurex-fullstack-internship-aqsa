# Testing evidence — Week 4

Run `cd backend && npm run test:api` and paste the output here:

```
(aurex-task-manager-backend@1.0.0 test:api
> node tests/api-test.js


Testing http://localhost:5000/api

Authentication
  PASS  Successful registration -> 201 + token
  PASS  Duplicate registration -> 409
  PASS  Invalid registration data -> 400
  PASS  Correct login -> 200 + token
  PASS  Incorrect password -> 401
  PASS  Unknown email (invalid login) -> 401

Authorization
  PASS  Protected route without token -> 401
  PASS  Protected route with valid token -> 200
  PASS  Invalid token -> 401
  PASS  Expired token -> 401
  PASS  GET /auth/me returns the user

Task CRUD
  PASS  Create task -> 201
  PASS  Create task with invalid title -> 400
  PASS  Read tasks -> contains the new task
  PASS  Update task -> 200
  PASS  Complete task -> completed is true
  PASS  Filter status=completed returns it
  PASS  Filter status=pending does not return it

Data isolation (User B must not touch User A's task)
  PASS  User B registered
  PASS  User B list does not contain A's task
  PASS  User B GET A's task -> 404
  PASS  User B PUT A's task -> 404
  PASS  User B DELETE A's task -> 404

Cleanup
  PASS  Delete task (owner) -> 200
  PASS  Deleted task is gone -> 404

25 passed, 0 failed
Note: "Logout" is a frontend action (the token is removed in the browser) - test it manually in the UI.
PS C:\Users\Smart Computers\Downloads\aurex-fullstack-internship\week-4-fullstack-task-manager\backend> )
```

## Manual UI checklist (tick and add screenshots)
**Authentication**
- [ ] Register with valid data → lands on the dashboard
- [ ] Register with an email that already exists → error shown
- [ ] Register with short password / mismatching confirm → validation messages
- [ ] Login with correct data → dashboard
- [ ] Login with wrong password → "Invalid email or password"
- [ ] Logout → back to login screen; refreshing the page keeps you logged out
- [ ] Refresh while logged in → still logged in

**Authorization**
- [ ] Open Postman: `GET /api/tasks` without a token → 401
- [ ] Same request with a valid token → 200
- [ ] Same request with a random/invalid token → 401
- [ ] Delete the token in DevTools (Application → Local Storage) and click any action → you are logged out

**Tasks**
- [ ] Add a task (valid) / add with a 1–2 character title → validation message
- [ ] Edit a task → changes appear
- [ ] Mark complete / un-complete
- [ ] Filter All / Pending / Completed and by priority
- [ ] Delete a task (confirm dialog)

**Data isolation**
- [ ] Register two users in two browsers (or one normal + one incognito)
- [ ] User A adds tasks → User B's dashboard does NOT show them
- [ ] In Postman, using B's token on `GET /api/tasks/<A's task id>` → 404
