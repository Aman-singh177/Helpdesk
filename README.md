Ticket Management Frontend
This is the frontend for the Ticket Management System — a simple React-based web app that connects to the Express + MongoDB backend.
It allows users to register, log in, create, view, update, and comment on tickets in real time.

Tech Stack
1.React (JavaScript)
2.React Router DOM
3.Fetch API for backend calls
4.CSS Modules / plain CSS
5.LocalStorage for JWT token handling

Features
1.User Registration & Login
2.JWT Authentication
3.Create / View / Update Tickets
4.Add Comments to Tickets
5.SLA Timer shown on ticket details
6.Idempotent ticket creation (avoids duplicate POSTs)
7.Responsive and minimal UI

Setup Instructions
1️. Clone the repo
git clone https://github.com/Aman-singh177/ticket-system-frontend.git
cd ticket-system-frontend
2️. Install dependencies
npm install

3️. Run the app
npm start


The app will open at http://localhost:3000

Make sure your backend (http://localhost:4000) is running before starting the frontend.

Pages Overview
Route	Description
/	Register page (create a new user)
/login	Login page for existing users
/tickets	List all tickets
/tickets/new	Create a new ticket
/tickets/:id	View ticket details and comments

Folder Structure
frontend/
│
├── pages/ 
│   ├── registerlogin.jsx            
│   ├── tickets/
│   │   ├── index.jsx           
│   │   ├── new.jsx             
│   │   └── TicketDetail.jsx    
│
├── components/
│   ├── TicketCard.jsx         
│   └── CommentThread.jsx      
│
│
└── package.json

Authentication Flow
1. Register a new user
Fill details on / (register page).
User gets saved via POST /api/auth/register.

2️. Login
Go to /login and enter email + password.
On success → token stored in localStorage.

3️. Protected Routes
/tickets, /tickets/new, and /tickets/:id require a valid token.
If token is missing or invalid, API returns INVALID_TOKEN.

Example Usage

Login
POST /api/auth/login
{
  "email": "testuser@example.com",
  "password": "123456"
}


Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Token is automatically stored in browser’s localStorage.

Create New Ticket

Route: /tickets/new

Sends:
{
  "title": "Server down",
  "description": "Staging server is not responding",
  "priority": "high"
}

Headers:

Authorization: Bearer <token>
Idempotency-Key: <timestamp>


Redirects back to /tickets after success.

Add Comment

Route: /tickets/:id

Sends:
{
  "message": "We are looking into this issue."
}


Comment instantly updates the UI after posting.

SLA Display

Each ticket shows:

Priority

Status

SLA Due: Auto-calculated based on backend logic
(High = 4h, Medium = 24h, Low = 48h)


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