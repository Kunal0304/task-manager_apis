# Node.js Task Manager API

## Description

This is the backend API for the Task Manager application built with Node.js and Express. It supports CRUD operations for task management, including user authentication using JWT.

## Deployed API

You can access the live API here: [Visit the Deployed API](https://task-manager-backend-7nni.onrender.com)

You can also directly visit the API at the following URL:  
`https://task-manager-backend-7nni.onrender.com`

## Technologies Used
- Node.js
- Express.js
- PostgreSQL (or your chosen database)
- JWT for Authentication
- dotenv for environment variables

## Setup Instructions

### Prerequisites

1. Node.js and npm (Node Package Manager) installed.
2. PostgreSQL (or your chosen database) set up and running.

### Steps to Set Up Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/Sushantshekharzz/task-manager-backend.git  
    ```

2. Navigate to the project directory:

    ```bash
    cd task-manager-backend
    ```

3. Install the necessary dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables by creating a `.env` file in the root directory. Example:

    ```
    HOST=localhost
    DB_USER=your-db-user
    PASSWORD=your-db-password
    DB=your-db-name
    secret_key=your-jwt-secret
    ```

5. Run database migrations :

    ```bash
    npx sequelize-cli db:migrate
    ```

6. Start the server:

    ```bash
    npm start
    ```

   The API will be available at `http://localhost:4000`

## API Endpoints

### 1. **User Sign-Up**
- **POST** `/signup`
- **Description**: Registers a new user by checking if the username already exists and hashing the password before storing the user information.

#### Request Body:
```json
{
  "userName": "your-username",
  "passWord": "your-password",
  "role": "user-role",
  "name": "user-name"
}
```
#### Response (Success):
```json
{
   "message": "User Created successfully"
}
```
#### Response (Failure):
- User Already Exists:
```json
{
  "message": "User already exists. Please choose a different email or username."
}
```

- Server Error:
```json
{ 
    "message": "Internal server error." 
}
```



### 2. **User Sign-In**
- **POST** `/signin`
- **Description**: Authenticates a user and returns a JWT token upon successful login.
  
#### Request Body:
```json
{
  "userName": "your-username",
  "passWord": "your-password"
}
```
#### Response (Success):
```json
{
  "message": "Successfully Login",
  "token": "jwt-token-here",
  "role": "user-role",
  "name": "user-name"
}
```
#### Response (Failure):
- User Not Found:
```json
{ 
    "message": "User not found" 
}
```

- Unauthorized:
```json
{ 
    "message": "Unauthorized User" 
}
```
- Server Error:
```json
{ 
    "message": "Internal server error." 
}
```

**Authentication**: Use the JWT token in the Authorization header for subsequent requests:
`Authorization: Bearer <jwt-token>`

### 3. **Create Task**
- **POST** `/tasks`
- **Description**: Adds a new task to the system.
- **Authorization**: Requires authentication (JWT Token).
  
#### Request Body:
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "priority": "high",
  "assignedUsers": ["user1", "user2"],
  "dueDate": "2025-01-25T12:00:00Z",
  "status": "pending"
}
```
#### Response (Success):
```json
{
  "message": "Task Added successfully."
}
```
#### Response (Failure):
```json
{
  "message": "Internal server error."
}
```



### 4. **Get All Tasks**
- **GET** `/tasks`
- **Description**: Retrieves all tasks based on the user role (Admin or User).
- **Authorization**: Requires authentication (JWT Token).
#### Response (Admin):
```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "Description of Task 1",
    "priority": "high",
    "assignedUsers": ["user1", "user2"],
    "dueDate": "2025-01-25T12:00:00Z",
    "status": "Completed"
  }
]
```
#### Response (User):
```json
[
  {
    "id": 1,
    "title": "Assigned Task",
    "description": "Description of Assigned Task",
    "priority": "medium",
    "assignedUsers": ["user1"],
    "dueDate": "2025-01-25T12:00:00Z",
    "status": "ToDo"
  }
]
```
#### Response (Failure):
```json
{
  "message": "Unauthorized access"
}
```
- Server Error:
```json
{ 
    "message": "Internal server error." 
}
```



### 5. **Get Task by ID**
- **GET** `/tasks/:id`
- **Description**:  RRetrieves a specific task by its ID.
- **Authorization**: Requires authentication (JWT Token).
#### Response (Success):
```json
{
  "id": 1,
  "title": "Task 1",
  "description": "Description of Task 1",
  "priority": "high",
  "assignedUsers": ["user1", "user2"],
  "dueDate": "2025-01-25T12:00:00Z",
  "status": "pending"
}
```
#### Response (Failure):
```json
{
  "message": "Internal server error."
}
```




### 6. **Delete Task**
- **DELETE** `/tasks/:id`
- **Description**: :Deletes a task by its ID.
- **Authorization**: Requires authentication (JWT Token).
#### Response (Success):
```json
{
    "message": "Task deleted successfully."
}
```
#### Response (Failure):
```json
{
  "message": "Task not found"
}
```
### 7. **Update Task**
- **PUT** `/tasks/:id`
- **Description**: : Updates an existing task's details.
- **Authorization**: Requires authentication (JWT Token).
#### Request Body:
```json
{
  "status": "Coompleted",
  "priority": "Medium",
  "assignedUsers": ["user1"],
  "title": "Updated Task Title",
  "description": "Updated task description",
  "dueDate": "2025-02-01T12:00:00Z"
}
```

#### Response (Success):
```json
{
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Task Title",
    "description": "Updated task description",
    "priority": "medium",
    "assignedUsers": ["user1"],
    "dueDate": "2025-02-01T12:00:00Z",
    "status": "completed"
  }
}
```
#### Response (Failure):
```json
{
  "message": "Error updating task"
}
```


### 8. **Create User**
- **POST** `/users`
- **Description**: : Creates a new user. Only accessible by the admin.
- **Authorization**: Requires authentication (JWT Token).
#### Request Body:
```json
{
  "userName": "new-username",
  "passWord": "user-password",
  "role": "user-role",
  "name": "user-name"
}
```

#### Response (Success):
```json
{
   "message": "User Created successfully"
}
```
#### Response (Failure):
```json
{
  "message": "User already exists. Please choose a different email or username."
}
```


### 9. **Get All Users**
- **GET** `/users`
- **Description**: : Retrieves all users created by the admin.
- **Authorization**: Requires authentication (JWT Token).

#### Response (Success):
```json

[
  {
    "id": 1,
    "userName": "user1",
    "name": "User One",
    "role": "admin"
  },
  {
    "id": 2,
    "userName": "user2",
    "name": "User Two",
    "role": "user"
  }
]

```
#### Response (Failure):
```json
{
  "message": "Internal server error."
}
```


### `10. **Get User by ID**
- **GET** `/users/:id`
- **Description**: : Retrieves a specific user by their ID.
- **Authorization**: Requires authentication (JWT Token).

#### Response (Success):
```json
{
  "id": 1,
  "userName": "user1",
  "name": "User One",
  "role": "admin"
}
```
#### Response (Failure):
```json
{
  "message": "Internal server error."
}
```


### 11. **Update User**
- **PUT** `/users/:id`
- **Description**: :Updates a user’s details (e.g., username, name). Only accessible by the admin.
- **Authorization**: Requires authentication (JWT Token).
#### Request Body:
```json
{
  "userName": "updated-username",
  "name": "Updated User Name"
}
```

#### Response (Success):
```json
{
  "message": "User updated successfully."
}
```
#### Response (Failure):
```json
{
  "message": "User not found or not authorized to update."
}
```





### 12. **Delete User**
- **PUT** `/users/:id`
- **Description**: :Deletes a user by their ID. Only accessible by the admin.
- **Authorization**: Requires authentication (JWT Token).

#### Response (Success):
```json
{
  "message": "User deleted successfully."
}
```
#### Response (Failure):
```json
{
  "message": "No user found with the given criteria."
}
```



















## Running Tests

You can run the tests for the application using:

```bash
npm test
