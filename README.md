# Student Empower Platform - Architecture & Guide

## 1. Project Structure

This project follows a standard MERN (MongoDB, Express, React, Node.js) architecture.

### Backend (`/backend`)
*   **`server.js`**: The entry point. Connects to MongoDB, sets up Middleware (CORS, JSON parsing), and loads Routes.
*   **`models/` (Schemas)**: Defines the structure of data stored in MongoDB.
    *   `User.js`: Stores user credentials (`username`, `password`, `role`, `classId`).
    *   `StudentLog.js`: Stores daily habit logs.
    *   `Chapter.js`: Stores academic content metadata.
    *   `Doubt.js`: Stores Q&A threads.
*   **`controllers/`**: Contains the actual business logic (e.g., how to register a user, how to process a login). This keeps routes clean.
*   **`routes/`**: Defines the API endpoints (URL paths) and maps them to controllers.
*   **`middleware/`**: Functions that run *before* the controller (e.g., `auth.js` checks if a user is logged in).

### AI Models Used
The application now uses **Google Gemini** for all AI features:
- **Model**: `gemini-1.5-flash`
- **Key**: `GEMINI_API_KEY` in `backend/.env`.

> **Note**: OpenAI (`gpt-3.5-turbo`) has been fully removed.

### Frontend (`/frontend`)

### Core Dependencies
- **react**: `^19.2.0`
- **recharts**: `^2.13.0` (Visual Analytics)
*   **`src/pages/`**: React components representing full pages (Login, Dashboard, HabitTracker).
*   **`src/components/`**: Reusable UI parts (Sidebar, Navbar).
*   **`src/context/`**: Manages global state (like the current logged-in user).

---

## 2. Authentication Flow

How does the system know who you are?

1.  **Registration**:
    *   **User Input**: You fill out the form in `Login.jsx` (toggled to Register).
    *   **Request**: Frontend sends `POST /api/auth/register` with `{ username, password, role, classId }`.
    *   **Backend**: `authController.register` receives this. It hashes the password (scrambles it for safety) and saves a new document to the `users` collection in MongoDB.

2.  **Login**:
    *   **User Input**: You enter username/password.
    *   **Request**: Frontend sends `POST /api/auth/login`.
    *   **Backend**: `authController.login` checks if the user exists and if the hashed password matches.
    *   **Response**: If valid, it generates a **JWT (JSON Web Token)**. This token is like a digital ID card signed by the server. It contains your ID and Role.
    *   **Frontend**: Saves this token in `localStorage`.

3.  **Accessing Protected Pages**:
    *   When you visit `/habits`, the React app checks if you have a token.
    *   When the app fetches data (e.g., `GET /api/student-logs`), it attaches the token to the header (`Authorization: Bearer <token>`).
    *   **Backend**: The `verifyToken` middleware checks the token. If it's valid, it lets the request through; otherwise, it blocks it (403 Forbidden).

---

## 3. Data Storage (MongoDB Schemas)

Data is stored in "Collections" (like tables). Here is the schema breakdown:

### `User` Collection
*   `username`: Unique ID.
*   `password`: Hashed string (never plain text).
*   `role`: 'student' or 'teacher'.
*   `classId`: Links the user to a specific class group (e.g., 'ClassA').

### `StudentLog` Collection
*   `userId`: Links to the User.
*   `date`: When the log was created (has a 30-day auto-delete timer).
*   `hours`, `mood`, `goals`, `reflection`: The actual data.

### `Doubt` Collection
*   `question`: The student's query.
*   `aiAnswer`: Auto-generated response.
*   `teacherAnswer`: Verified response.
*   `classId`: Keeps doubts organizing by class.

---

## 4. How to Use

### Login / Register
Go to `/login`. Use the toggle link at the bottom to switch between "Login" and "Create Account".

### Student Workflow
1.  **Dashboard**: See your quick links.
2.  **Habit Tracker**: Log your daily progress. Ask the AI Mentor for advice.
3.  **Doubt Forum**: Ask questions about your subjects.

### Teacher Workflow
1.  **Upload Content**: Add PDFs for your class.
2.  **Review Doubts**: Verify or correct AI answers for your students.
3.  **Analytics**: Check the health of your class.

## 5. Versions
*   **Node**: v24.12.0
*   **React**: v19.2.0
*   **Express**: v5.2.1
