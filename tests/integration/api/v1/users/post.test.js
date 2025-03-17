import orchestrator from "tests/orchestrator.js";
import database from "infra/database";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/users", () => {
  describe("Anonymous user", () => {
      test("With unique and valid data", async () => {
 /*       await database.query({
          text:'INSERT INTO users (username, email, password) VALUES ($1, $2, $3);',
           values: ["joashneves", "joashneves@gmail.com", "nicollemeuamor"],});
*/
        const response = await fetch(
          "http://localhost:3000/api/v1/users",
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: 'joashneves',
              email: 'joashneves@gmail.com',
              password: 'nicollemeuamor',
            }),
          },
        );
        expect(response.status).toBe(201);
        
        const responseBody = await response.json();
        console.log(responseBody);
        expect(responseBody).toEqual({
          id: responseBody.id,
          username: 'joashneves',
          email: 'joashneves@gmail.com',
          password: 'nicollemeuamor',
          created_at: responseBody.created_at,
          updated_at: responseBody.updated_at
        });
        expect(uuidVersion(responseBody.id)).toBe(4);
        expect(Date.parse(responseBody.created_at)).not.toBeNaN();
        expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      });
  });
});
