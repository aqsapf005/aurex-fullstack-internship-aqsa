# Week 3 — REST API + MongoDB CRUD

A backend built with **Node.js, Express.js, MongoDB (Atlas) and Mongoose**. The resource is **Tasks**.

## Setup
```bash
npm install
cp .env.example .env     # then edit .env with YOUR MongoDB Atlas connection string
npm run dev              # development (nodemon)  |  npm start for normal run
```
Server runs on `http://localhost:5000`.

### MongoDB Atlas (quick steps)
1. Create a free account + free **M0** cluster on https://www.mongodb.com/atlas
2. *Database Access* → add a database user (username + password)
3. *Network Access* → add your IP (or `0.0.0.0/0` for learning only)
4. *Connect → Drivers* → copy the connection string into `MONGODB_URI` in `.env`
5. Take a screenshot of your cluster + collection for the submission ("Atlas setup evidence")

> ⚠️ Never commit `.env`. It is listed in `.gitignore`. Only `.env.example` (without real secrets) goes to GitHub.

## Endpoints
| Operation | Method & URL | Success | Errors |
| --- | --- | --- | --- |
| Create | `POST /api/tasks` | 201 | 400 validation |
| Read all | `GET /api/tasks` | 200 | — |
| Read one | `GET /api/tasks/:id` | 200 | 400 bad id, 404 not found |
| Update | `PUT /api/tasks/:id` | 200 | 400, 404 |
| Delete | `DELETE /api/tasks/:id` | 200 | 400, 404 |

### Example request / response
`POST /api/tasks`
```json
{ "title": "Learn Express", "description": "Finish week 3", "priority": "high" }
```
`201 Created`
```json
{
  "success": true,
  "task": {
    "_id": "665f...", "title": "Learn Express", "description": "Finish week 3",
    "completed": false, "priority": "high",
    "createdAt": "2026-...", "updatedAt": "2026-..."
  }
}
```
Error example (`400`): `{ "success": false, "message": "Title must be at least 3 characters" }`

## Data model (Mongoose `Task`)
| Field | Type | Rules |
| --- | --- | --- |
| title | String | required, trimmed, 3–100 chars |
| description | String | optional, max 500 |
| completed | Boolean | default `false` |
| priority | String | `low` / `medium` / `high`, default `medium` |
| createdAt / updatedAt | Date | automatic (`timestamps: true`) |

## Request flow
`Client → Route → Controller → Mongoose Model → MongoDB → Response → Client`

## Folder structure
```
src/
 ├── config/db.js            # MongoDB connection
 ├── models/Task.js          # schema + model
 ├── controllers/            # logic for each endpoint
 ├── routes/                 # URL → controller mapping
 ├── middleware/errorHandler.js
 └── server.js               # app entry point
```

## Testing with Postman
Import `postman_collection.json` (Postman → Import). It contains successful **and** failing requests (invalid body, invalid id, not found) with automatic status-code checks. Run the collection top to bottom and take screenshots for your submission.

## Learning summary / Blockers
<!-- Write these in your own words -->
