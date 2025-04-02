# Task Management System

## Overview
The **Task Management System** is a web application that helps users manage tasks efficiently. It provides features like task creation, updating, deletion, filtering, and authentication.

## Features
- User authentication with JWT (Login & Registration)
- Create, update, delete, and retrieve tasks
- Filter tasks by status (`Pending`, `Completed`, `Overdue`,`Blocker`)
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

- ![Screenshot 2025-03-31 001238](https://github.com/user-attachments/assets/0c0a31cb-bb72-46db-ab83-0b3270208e04)


### Task Management
- `POST /tasks` → Create a new task
- `GET /tasks/user` → Get all tasks
- `GET /tasks/{id}` → Get a task by ID
- `PUT /tasks/{id}` → Update a task
- `DELETE /tasks/{id}` → Delete a task


![Screenshot 2025-03-31 000439](https://github.com/user-attachments/assets/8ee2ef65-2405-4bd8-85f1-fe5003b64904)



## Setup Instructions

#### **1. Clone the Repository**
```bash
git clone <repository_url>
cd task-management-system
```

#### **2. Configure the Database**
- Install **PostgreSQL** and create a database:
  ```sql
  CREATE DATABASE task_management;
  ```
- Update `src/main/resources/application.properties` with your database credentials:
  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/task_management
  spring.datasource.username=your_db_username
  spring.datasource.password=your_db_password

  spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
  spring.jpa.hibernate.ddl-auto=update
  ```

#### **3. Build & Run the Backend**
- Install **Maven** dependencies:
  ```bash
  mvn clean install
  ```
- Run the Spring Boot application:
  ```bash
  mvn spring-boot:run
  ```
- Backend will start on **`http://localhost:8080`**

---

### 🎨 Frontend Setup (HTML, CSS, JavaScript)
#### **1. Open the Frontend**
- Navigate to the `frontend/` folder:
  ```bash
  cd frontend
  ```
- Open `entry.html` in VSCODE and go live on PORT 5500 using LIVE SERVER :

#### **2. Connect Frontend to Backend**
- Ensure `fetch` requests in JavaScript use the correct **backend URL (`http://localhost:8080`)**.
- Example API call in `script.js`:
  ```javascript
  fetch("http://localhost:8080/tasks", {
    method: "GET",
    headers: {
      "Authorization": "Bearer your_jwt_token",
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
  ```

#### **3. Run the Application**
- increase your productivity by organising daily tasks!

---

## FUTURE ENHANCEMENTS
- User Account Management
- Email notifications for approaching deadlines
- Dark/light theme toggle
- Task categories and tags
- Role based Access Control (Admin, User)


  

