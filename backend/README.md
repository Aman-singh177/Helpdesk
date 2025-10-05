HelpDesk Mini  Backend
This is the backend for the Ticket Management System built for the hackathon.
It provides secure REST APIs for authentication, ticket CRUD, comments, SLA tracking, and idempotent operations.

⚙️ Tech Stack
1. Node.js + Express.js
2. MongoDB + Mongoose
3. JWT Authentication
4. CORS Enabled
5. SLA Tracking
6. Idempotency Key System
7. Optimistic Locking for Updates

Setup Instructions
1️. Clone the repo
git clone https://github.com/Aman-singh177/ticket-system-backend.git
cd ticket-system-backend

2️. Install dependencies
npm install

3️. Create .env file
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/tickets
JWT_SECRET=supersecretkey

4️. Run server
npm run dev

Server runs at:
http://localhost:4000

API Summary
1. Authentication
➕ Register User
POST /api/auth/register

Request
{
  "name": "Hackathon User",
  "email": "testuser@example.com",
  "password": "123456",
  "role": "user"
}

Response
{
  "message": "User registered successfully",
  "user": {
    "_id": "68d4d2bb9f91ce6a41e954a9",
    "name": "Hackathon User",
    "email": "testuser@example.com"
  }
}

Login
POST /api/auth/login

Request
{
  "email": "amasingh@gmail.com",
  "password": "123456"
}


Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}

2. Tickets
 Create Ticket

POST /api/tickets

Headers:

Authorization: Bearer <token>
Idempotency-Key: abc123


Body
{
  "title": "Server down",
  "description": "Staging server not responding",
  "priority": "high"
}


Response
{
  "_id": "68e164c48d99b0708b2c6453",
  "title": "Server down",
  "priority": "high",
  "status": "open",
  "sla_due": "2025-10-05T00:17:40.078Z"
}


If the same Idempotency-Key is sent again:
{
  "error": { "code": "DUPLICATE_REQUEST" }
}

Get All Tickets
GET /api/tickets?limit=20&offset=0

Response
{
  "items": [
    {
      "_id": "68e164c48d99b0708b2c6453",
      "title": "Cannot login",
      "status": "open",
      "priority": "high",
      "sla_due": "2025-10-05T00:17:40.078Z"
    }
  ],
  "next_offset": null
}

Get Ticket by ID
GET /api/tickets/:id

Response
{
  "_id": "68e164c48d99b0708b2c6453",
  "title": "Cannot login",
  "description": "Login fails after password reset",
  "priority": "high",
  "status": "open",
  "comments": []
}

Update Ticket (status / priority / assignee)

PATCH /api/tickets/:id
Request
{
  "status": "in_progress"
}


Response
{
  "message": "Ticket updated successfully",
  "ticket": {
    "_id": "68e164c48d99b0708b2c6453",
    "status": "in_progress",
    "version": 2
  }
}


If version conflict occurs:
{
  "error": "Conflict - Ticket already updated (409)"
}

3. Comments
Add Comment


POST /api/tickets/:id/comments

Request
{
  "message": "We are working on this issue."
}


Response
{
  "message": "Comment added successfully",
  "ticket": {
    "_id": "68e164c48d99b0708b2c6453",
    "comments": [
      { "message": "We are working on this issue." }
    ]
  }
}

4. SLA Tracking
Each ticket auto-calculates sla_due based on priority:
Priority	SLA (hours)
High	4
Medium	24
Low	48

Example:
"sla_due": "2025-10-05T00:17:40.078Z"

5. Breached Tickets

GET /api/tickets?status=breached
Returns only tickets whose sla_due < now.