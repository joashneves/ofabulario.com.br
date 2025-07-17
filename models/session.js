import database from "infra/database";
import crypto from "node:crypto";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 40 * 1000; // 40 Days

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const result = await database.query({
      text: `
        INSERT INTO
            sessions (token, user_id, expires_at)
        VALUES
            ($1, $2, $3)
        RETURNING
            *;`,
      values: [token, userId, expiresAt],
    });
    return result.rows[0];
  }
}

const session = {
  EXPIRATION_IN_MILLISECONDS,
  create,
};

export default session;
