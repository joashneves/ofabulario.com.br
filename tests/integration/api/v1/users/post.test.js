import orchestrator from "tests/orchestrator.js";
import database from "infra/database";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/users", () => {
  describe("Anonymous user", () => {
      test("With unique and valid data", async () => {
        await database.query({
          text:'INSERT INTO users (username, email, password) VALUES ($1, $2, $3);',
           values: ["joashneves", "joashneves@gmail.com", "nicollemeuamor"],});

           await database.query({
            text:'INSERT INTO users (username, email, password) VALUES ($1, $2, $3);',
             values: ["Joashneves", "Joashneves@gmail.com", "nicollemeuamor"],});
        const user = await database.query("SELECT * FROM users;");
        console.log(user.rows);
        const response = await fetch(
          "http://localhost:3000/api/v1/users",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
      });
  });
});
