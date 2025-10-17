const { CosmosClient } = require("@azure/cosmos");

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const client = new CosmosClient(connectionString);

const databaseId = "tasksdb";
const containerId = "tasks";

module.exports = async function (context, req) {
  context.log("HTTP POST /api/addTask triggered");

  try {
    const task = req.body;

    if (!task || !task.id || !task.title) {
      context.res = {
        status: 400,
        body: { message: "Invalid task payload. Must include 'id' and 'title'." },
      };
      return;
    }

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Create the task
    const { resource: createdItem } = await container.items.create(task);

    context.res = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      body: createdItem,
    };
  } catch (err) {
    context.log("Error:", err);
    context.res = {
      status: 500,
      body: { message: "Failed to add task", error: err.message },
    };
  }
};
