// src/functions/getTasks/index.js
const { CosmosClient } = require("@azure/cosmos");
const validateToken = require('../validateToken'); // adjust if needed

// Connect to Cosmos DB using the connection string from environment variables
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const client = new CosmosClient(connectionString);

// Update these names to match your Cosmos DB configuration
const databaseId = "tasksdb";
const containerId = "tasks";

/**
 * Azure Function: GET /api/getTasks
 * Requires a valid Bearer token from the OAuth mock server.
 * Fetches all tasks from Cosmos DB.
 */
module.exports = async function (context, req) {
  // Step 1: Validate the incoming JWT token
  const decoded = validateToken(req, {
    status: (code) => ({
      json: (obj) => context.res = { status: code, body: obj }
    })
  });
  if (!decoded) return; // Stop if token invalid

  // Step 2: Fetch data from Cosmos DB
  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const { resources: items } = await container.items.readAll().fetchAll();

    // Step 3: Return the results
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        user: decoded.username,
        tasks: items
      }
    };
  } catch (err) {
    context.log("Error fetching tasks:", err);
    context.res = {
      status: 500,
      body: { message: "Error fetching tasks", error: err.message }
    };
  }
};
