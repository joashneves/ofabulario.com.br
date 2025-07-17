import orchestrator from "tests/orchestrator.js";
import session from "models/session.js";
import { version as uuidVersion } from "uuid";
import setCookieParser from "set-cookie-parser";

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

    test("with incorrect `email` and correct `password`", async () => {
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

    test("with correct `email` and correct `password`", async () => {
      const userCorrect = await orchestrator.createUser({
        password: "senha123",
      });
      console.log(userCorrect);
      const response = await fetch("http://localhost:3000/api/v1/session", {
        method: "POST",
        headers: {
          "Content-Type": "aplication/json",
        },
        body: JSON.stringify({
          email: userCorrect.email,
          password: "senha123",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody2 = await response.json();

      expect(responseBody2).toEqual({
        id: responseBody2.id,
        token: responseBody2.token,
        user_id: userCorrect.id,
        expires_at: responseBody2.expires_at,
        created_at: responseBody2.created_at,
        updated_at: responseBody2.updated_at,
      });
      expect(uuidVersion(responseBody2.id)).toBe(4);
      expect(Date.parse(responseBody2.expires_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody2.updated_at)).not.toBeNaN();

      const expiresAt = new Date(responseBody2.expires_at);
      const createdAt = new Date(responseBody2.created_at);

      expiresAt.setMilliseconds(0);
      createdAt.setMilliseconds(0);

      expect(expiresAt - createdAt).toBe(session.EXPIRATION_IN_MILLISECONDS);

      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: responseBody2.token,
        maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });
  });
});
