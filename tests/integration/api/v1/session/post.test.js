import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to /api/v1/session", () => {
  describe("Anonumous user", () => {
    test("with incorrect `email` but correct `password`", async () => {
      const userTest = await orchestrator.createUser({
        password: "supersenha",
      });

      const response = await fetch("http://localhost:3000/api/v1/session", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({
          email: "emailerrado@curso.dev",
          password: userTest.password,
        }),
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "unauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão correto",
        status_code: 401,
      });
    });

    test("with correct `email` but incorrect `password`", async () => {
      const userTest2 = await orchestrator.createUser({
        password: "senhaerrada",
      });

      const response2 = await fetch("http://localhost:3000/api/v1/session", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({
          email: userTest2.email,
          password: "supersenha",
        }),
      });
      expect(response2.status).toBe(401);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "unauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão correto",
        status_code: 401,
      });
    });

    test("with incorrect `email` and incorrect `password`", async () => {
      await orchestrator.createUser({});

      const response2 = await fetch("http://localhost:3000/api/v1/session", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({
          email: "emailu@gmail.com",
          password: "supers123a",
        }),
      });
      expect(response2.status).toBe(401);

      const responseBody2 = await response2.json();

      expect(responseBody2).toEqual({
        name: "unauthorizedError",
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão correto",
        status_code: 401,
      });
    });
  });
});
