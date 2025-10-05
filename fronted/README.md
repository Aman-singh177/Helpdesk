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