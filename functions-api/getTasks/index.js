const { CosmosClient } = require("@azure/cosmos");

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const client = new CosmosClient(connectionString);

// Update names to match your Cosmos DB
const databaseId = "tasksdb";
const containerId = "tasks";

module.exports = async function (context, req) {
  context.log("HTTP GET /api/tasks triggered");

  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const { resources: items } = await container.items.readAll().fetchAll();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: items
    };
  } catch (err) {
    context.log("Error: ", err);
    context.res = {
      status: 500,
      body: { message: "Error fetching tasks", error: err.message }
    };
  }
};
