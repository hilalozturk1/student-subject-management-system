# Student Management System

This project is a web application for managing students, courses, and enrollments with user roles (admin and student).  
Users can register, log in, enroll in courses, and admins can manage all records via the panel.

---

## Features

- User registration and login
- Admin and student roles
- Student, course, and enrollment management
- Admin: add, delete, update students/courses, manage enrollments
- Student: view and manage own enrollments
- Modern UI with Tailwind CSS
- JWT-based authentication

---

## Technology Stack

- **Backend:** Django, Django REST Framework, Djoser, PostgreSQL
- **Frontend:** Next.js (React), Tailwind CSS
- **Other:** Docker, JWT

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/student-subject-management-system.git
cd student-subject-management-system
```

### 2. Set Environment Variables

- Copy `.env.example` to `.env` for both backend and frontend, and configure as needed.

### 3. Start with Docker (Recommended)

```bash
docker-compose up --build
```

- This command starts backend, frontend, and the database.
- Migrations and sample admin/student data are created automatically.

---

## Example Login Credentials

- **Admin:**  
  Username: `admin`  
  Password: `admin`

- **Student:**  
  Username: `student1`  
  Password: `student1`  
  (or `student2`, `student3`)

---

## Running Tests

To run all backend tests (students, courses, enrollments) inside Docker, use:

```bash
docker compose up test
```
---

## Notes

- Migration files and sample data commands are included in the repo.
- Each developer should create their own virtual environment and install dependencies from `requirements.txt`.

