# Task Management System

## Overview
The **Task Management System** is a web application that helps users manage tasks efficiently. It provides features like task creation, updating, deletion, filtering, and authentication.

## Features
- User authentication with JWT (Login & Registration)
- Create, update, delete, and retrieve tasks
- Filter tasks by status (`Pending`, `Completed`, `Overdue`)
- Prioritize tasks (`Low`, `Medium`, `High`)
- Secure backend with Spring Boot & PostgreSQL

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Spring Boot (Java)
- **Database:** PostgreSQL
- **Authentication:** JWT-based authentication
- **Tools:** Postman (API testing)

## API Endpoints

### Authentication
- `POST /register` → Register a new user
- `POST /login` → Authenticate user & get JWT token

### Task Management
- `POST /tasks` → Create a new task
- `GET /tasks` → Get all tasks
- `GET /tasks/{id}` → Get a task by ID
- `PUT /tasks/{id}` → Update a task
- `DELETE /tasks/{id}` → Delete a task

## Architecture Diagram
*(Include your architecture diagram here if available)*

## ER Diagram
*(Include your entity-relationship diagram here if available)*

## Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd task-management-system

