# Task 3 — Persistent Data Layer

Integration of a real, persistent database into the Users, Projects & Tasks REST API, with relationships modeled correctly and configuration handled securely. This is the data layer that Task 2's API is built on, and that Task 4's platform will ultimately depend on.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (via Mongoose ODM)
- **Validation:** express-validator + Mongoose schema validation
- **Config:** dotenv (environment variables)

## Task 3 Requirements Met

- **User data storage** — persisted via the `User` Mongoose model (`src/models/User.js`)
- **Project data storage** — persisted via the `Project` model (`src/models/Project.js`)
- **Task data storage** — persisted via the `Task` model (`src/models/Task.js`)
- **Full CRUD operations** across all three entities (Users, Projects, Tasks)
- **Data validation at the schema level** — required fields, email format, enums for `role`, `status`, and `priority` all enforced by Mongoose
- **Relationships between entities:**
  - `Project.owner` references a `User`
  - `Task.project` references a `Project`
  - `Task.assignee` references a `User`
- **Secure database configuration** — MongoDB connection string is loaded from `.env` and never hard-coded (see `.env.example`)

## Architecture

```
Frontend → REST API → Backend → Database
```

(Frontend built separately in Task 1: DevDash)

## Project Structure

```
task3-persistent-data-layer/
├── src/
│   ├── config/db.js            MongoDB connection
│   ├── models/                 Mongoose schemas (User, Project, Task)
│   ├── controllers/            Route handler logic
│   ├── routes/                 Express routers + validation rules
│   ├── middleware/              errorHandler, validate, asyncHandler
│   └── app.js                  App entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd task3-persistent-data-layer
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=5000
   MONGODB_URI=<your MongoDB connection string>
   NODE_ENV=development
   ```

3. Start the server:
   ```bash
   npm run dev     # with nodemon (auto-restart)
   # or
   npm start
   ```

4. Server runs at `http://localhost:5000`. Visit `/` for a health check.

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, validated format |
| role | String | enum: `admin`, `member` (default `member`) |

### Project
| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | optional |
| owner | ObjectId → User | required |
| status | String | enum: `active`, `archived` (default `active`) |

### Task
| Field | Type | Notes |
|---|---|---|
| title | String | required |
| description | String | optional |
| project | ObjectId → Project | required |
| assignee | ObjectId → User | optional |
| status | String | enum: `todo`, `in-progress`, `done` (default `todo`) |
| priority | String | enum: `low`, `medium`, `high` (default `medium`) |
| dueDate | Date | optional |

## API Endpoints

### Users — `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users` | Create a user |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get a single user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Projects — `/api/projects`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/projects` | Create a project |
| GET | `/api/projects` | List all projects (owner populated) |
| GET | `/api/projects/:id` | Get a single project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks — `/api/tasks`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks?project=&status=&assignee=` | List tasks, optional filters |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update only the task's status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Response Format

Success:
```json
{ "success": true, "data": { ... } }
```

Error:
```json
{ "success": false, "message": "Descriptive error message" }
```

### Status Codes Used

- `200` OK — successful GET/PUT/PATCH/DELETE
- `201` Created — successful POST
- `400` Bad Request — validation failure / invalid id format
- `404` Not Found — resource or route doesn't exist
- `409` Conflict — duplicate value (e.g. email already exists)
- `500` Internal Server Error — unexpected server error

## Example Requests

Create a user:
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Kaviyazhini M","email":"kavi@example.com"}'
```

Create a project:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Project","owner":"<user_id>"}'
```

Create a task:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Design database schema","project":"<project_id>","priority":"high"}'
```

Update task status:
```bash
curl -X PATCH http://localhost:5000/api/tasks/<task_id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in-progress"}'
```

## Screenshots

_Add Postman/Thunder Client screenshots here after testing the endpoints locally._

## Notes

- No secrets are committed — see `.env.example` for required variables.
- MongoDB Atlas (free tier) works well for `MONGODB_URI`.
-