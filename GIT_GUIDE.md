# Git & GitHub guide

Create ONE repo on GitHub named `aurex-fullstack-internship-<yourname>` (this folder is its root). Make commits as you actually work through each week — mentors check the history.

```bash
git init
git branch -M main
git remote add origin https://github.com/<you>/aurex-fullstack-internship-<yourname>.git
```

Suggested commits (run after you have tried/changed each part yourself):

**Week 1**
```bash
git add week-1-react-task-manager && git commit -m "setup react project with vite"
# ...then commit as you go, for example:
#  "create task components"  |  "implement task creation"  |  "add task completion"
#  "add delete functionality" |  "add input validation"     |  "update documentation"
```
**Week 2:** `setup api dashboard project` → `add api layer with fetch` → `display employees with loading and error states` → `add search and city filter` → `add create update delete` → `update documentation`
**Week 3:** `setup express server` → `connect mongodb with mongoose` → `add task model` → `implement crud endpoints` → `add error handling and validation` → `add postman collection and docs`
**Week 4:** `add user model and auth routes` → `add jwt middleware` → `protect and scope task routes` → `setup frontend` → `add login and register pages` → `add task dashboard` → `add api tests` → `update documentation`

Before every push check: `git status` must NOT show any `.env` file.
```bash
git push -u origin main
```
