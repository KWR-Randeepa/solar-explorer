const { app } = require("@azure/functions");

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async () => ({
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "ok", service: "solar-explorer-api" })
  })
});
