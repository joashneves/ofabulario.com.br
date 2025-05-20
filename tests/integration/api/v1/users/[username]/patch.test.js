import { password } from "pg/lib/defaults";
import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user";
import password from "models/password";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Patch to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With nonexistent 'username'", async () => {
      const responsePatch = await fetch(
        "http://localhost:3000/api/v1/users/homeminvisivel",
        {
          method: "PATCH",
        },
      );

      expect(responsePatch.status).toBe(404);
      const responseBody = await responsePatch.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
        status_code: 404,
      });
      expect(Date.parse(responseBody.created_at)).toBeNaN();
      expect(Date.parse(responseBody.updated_at)).toBeNaN();
      console.log(responseBody);
    });

    test("With duplicated 'username' and invalid data", async () => {
      await orchestrator.createUser({
          username: "user1",
      })
        
      await orchestrator.createUser({
          username: "user2",
        });
      

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });
      expect(response.status).toBe(409);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username ja existe",
        action: "Escolha outro username",
        status_code: 409,
      });
    });

    test("With duplicated 'email' and invalid data", async () => {
     await orchestrator.createUser({email: "duplicadooutro@s3nha.com"})

      const createdUser2 = await orchestrator.createUser({ email: "Duplicado@s3nha.com"})
      console.log(createdUser2)
      const response5 = await fetch(
        `http://localhost:3000/api/v1/users/${createdUser2.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "Duplicado@s3nha.com",
          }),
        },
      );
      expect(response5.status).toBe(409);
      const response5Body = await response5.json();
      expect(response5Body).toEqual({
        name: "ValidationError",
        message: "Email ja existe",
        action: "Escolha outro email",
        status_code: 409,
      });
    });

    test("With unique'username' ", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailunico",
          email: "emialunico@s3nha.com",
          password: "senhagenerica",
        }),
      });
      expect(response.status).toBe(201);
      const responseunico = await fetch(
        "http://localhost:3000/api/v1/users/emailunico",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "emailunico",
            email: "emailunico1@s3nha.com",
            password: "SENHAAA",
          }),
        },
      );
      console.log(response.json());  
      const responseUnicoBody = await responseunico.json();
      console.log(responseUnicoBody);
      expect(responseUnicoBody.updated_at > responseUnicoBody.created_at).toBe(
        true,
      );

      const userInDatabase = await user.findOneByUsername("emailunico");
      const correcpPasswordMatch = await password.compare(
        "SENHAAA",
        userInDatabase.password,
      );
      expect(correcpPasswordMatch).toBe(true);

      const incorrecpPasswordMatch = await password.compare(
        "senhagenericaerrada",
        userInDatabase.password,
      );
      expect(incorrecpPasswordMatch).toBe(false);
    });
  });
});
