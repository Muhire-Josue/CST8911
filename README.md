# 🧠 CST8911 – Azure Function + Cosmos DB with Custom Authentication

This project was created as part of the **Introduction to Cloud Computing (CST8911)** course at Algonquin College. It demonstrates how to deploy a complete Azure-based solution using a **Function App**, **Cosmos DB**, and a **Virtual Machine**. The VM hosts a small mock OAuth server that issues JWT tokens used to secure two Azure Function endpoints (`/api/getTasks` and `/api/addTask`). The API reads and writes data from Cosmos DB and includes token validation middleware for access control.

---

## 🧩 Prerequisites

Before running this project, make sure you have:

- [Node.js 20+](https://nodejs.org/)
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- An **Azure for Students** subscription
- A **Cosmos DB (NoSQL)** instance created in your Azure portal

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Muhire-Josue/CST8911.git
cd CST8911
```
### 2. Start the Mock OAuth Server
The mock server runs on port 4000 and issues JWT tokens for testing.

cd mock-oauth-server
npm install
node server.js

### To generate a token, send a request:
POST http://localhost:4000/login
Content-Type: application/json

{
  "username": "josue"
}
### You’ll get a JWT token response like:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

### 4. Test the API Endpoints
Use any REST client (VS Code REST Client or Postman) to test the API.
Get All Tasks

GET http://localhost:7071/api/getTasks
Authorization: Bearer <your_jwt_token>


Add a New Task
POST http://localhost:7071/api/addTask
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "id": "3",
  "title": "Finish lab report",
  "category": "school",
  "status": "pending"
}

### Features
	•	Two serverless Azure Function endpoints (GET + POST)
	•	Cosmos DB NoSQL integration
	•	JWT-based authentication middleware
	•	Mock OAuth server hosted on Azure VM
	•	Cost-optimized deployment (Serverless + Consumption Plan)
