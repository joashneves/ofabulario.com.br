import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("Get to /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      await orchestrator.createUser({
        username: "MesmoCase",
        email: "Mesmocase@s3nha.com",
        password: "senhagenerica",
      });
      const responseGet = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(responseGet.status).toBe(200);
      const responseBody = await responseGet.json();
      console.log(responseBody);
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "MesmoCase",
        email: "Mesmocase@s3nha.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      await orchestrator.createUser({
        username: "CaseDiferente",
        email: "casediferente@s3nha.com",
        password: "senhagenerica",
      });

      const response2Get = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(response2Get.status).toBe(200);
      const response2Body = await response2Get.json();
      console.log(response2Body);
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "CaseDiferente",
        email: "casediferente@s3nha.com",
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });
      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response3Get = await fetch(
        "http://localhost:3000/api/v1/users/homeminvisivel",
      );

      expect(response3Get.status).toBe(404);
      const response3Body = await response3Get.json();
      expect(response3Body).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
        status_code: 404,
      });
      expect(Date.parse(response3Body.created_at)).toBeNaN();
      expect(Date.parse(response3Body.updated_at)).toBeNaN();
    });
  });
});
