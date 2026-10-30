# Testing evidence — Week 4

Run `cd backend && npm run test:api` and paste the output here:

```
(paste the terminal output)
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
