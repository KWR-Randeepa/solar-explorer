const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const { randomUUID } = require("node:crypto");

const TABLE_NAME = "SolarQuizResults";
let tableClient;
let tableCreation;

async function getTableClient() {
  const connectionString = process.env.STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("The STORAGE_CONNECTION_STRING application setting is missing.");
  }

  if (!tableClient) {
    tableClient = TableClient.fromConnectionString(connectionString, TABLE_NAME);
    tableCreation = tableClient.createTable().catch((error) => {
      // HTTP 409 means the table already exists, which is expected after first use.
      if (error.statusCode !== 409 && error.code !== "TableAlreadyExists") {
        throw error;
      }
    });
  }

  await tableCreation;
  return tableClient;
}

app.http("quizResult", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "quiz-result",
  handler: async (request, context) => {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Send a valid JSON request body." })
      };
    }

    const { score, totalQuestions } = payload || {};
    if (
      !Number.isInteger(score) ||
      !Number.isInteger(totalQuestions) ||
      totalQuestions !== 5 ||
      score < 0 ||
      score > totalQuestions
    ) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Score must be an integer from 0 to 5, and totalQuestions must be 5." })
      };
    }

    try {
      const table = await getTableClient();
      const submittedAt = new Date().toISOString();
      const entity = {
        partitionKey: submittedAt.slice(0, 10),
        rowKey: randomUUID(),
        Score: score,
        TotalQuestions: totalQuestions,
        SubmittedAt: submittedAt,
        QuizVersion: "solar-explorer-v1"
      };

      await table.createEntity(entity);
      context.log(`Stored anonymous quiz result ${entity.rowKey}`);

      return {
        status: 201,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Your quiz result was saved. Great work, space explorer!",
          score,
          totalQuestions,
          resultId: entity.rowKey
        })
      };
    } catch (error) {
      context.error("Unable to save quiz result", error);
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "We couldn't save your score right now. Please try again later." })
      };
    }
  }
});
