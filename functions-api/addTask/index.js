// src/functions/addTask/index.js
const { CosmosClient } = require("@azure/cosmos");
const validateToken = require('../validateToken'); // adjust if needed

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const client = new CosmosClient(connectionString);

const databaseId = "tasksdb";
const containerId = "tasks";

/**
 * Azure Function: POST /api/addTask
 * Requires a valid Bearer token from the OAuth mock server.
 * Inserts a new task into Cosmos DB.
 */
module.exports = async function (context, req) {
  // Step 1: Validate token
  const decoded = validateToken(req, {
    status: (code) => ({
      json: (obj) => context.res = { status: code, body: obj }
    })
  });
  if (!decoded) return; // stop execution if invalid token

  // Step 2: Validate request body
  const { id, title, category, status } = req.body || {};
  if (!id || !title || !category || !status) {
    context.res = {
      status: 400,
      body: { message: "Missing required fields: id, title, category, or status" },
    };
    return;
  }

  try {
    // Step 3: Insert new task into Cosmos DB
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const newTask = {
      id,
      title,
      category,
      status,
      createdBy: decoded.username, // attach username from token
      createdAt: new Date().toISOString(),
    };

    await container.items.create(newTask);

    // Step 4: Respond with confirmation
    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: { message: "Task added successfully", task: newTask },
    };
  } catch (err) {
    context.log("Error adding task:", err);
    context.res = {
      status: 500,
      body: { message: "Error adding task", error: err.message },
    };
  }
};
