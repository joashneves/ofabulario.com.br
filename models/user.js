import database from "infra/database";
import {NotFoundError, ValidationError } from "infra/errors";

async function create(usersInputValues) {
  await validateUniqueEmail(usersInputValues.email);
  await validateUniqueUsername(usersInputValues.username);
  const newUser = await runInsertQuary(usersInputValues);
  return newUser;

  async function validateUniqueUsername(username) {
    const result = await database.query({
      text: `SELECT
       username 
      FROM
       users 
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1;`,
      values: [username],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Username ja existe",
        action: "Cadastre outro username",
      });
    }
    return result.rows[0];
  }

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: `SELECT
       email 
      FROM
       users 
      WHERE
        LOWER(email) = LOWER($1)
      LIMIT
        1;`,
      values: [email],
    });
    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "Email ja existe",
        action: "Cadastre outro email",
      });
    }
    return result.rows[0];
  }

  async function runInsertQuary(usersInputValues) {
    const result = await database.query({
      text: `INSERT INTO 
       users (username, email, password) 
      VALUES
       ($1, $2, $3)
      RETURNING 
      *;
       `,
      values: [
        usersInputValues.username,
        usersInputValues.email,
        usersInputValues.password,
      ],
    });
    return result.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `SELECT
       * 
      FROM
       users 
      WHERE
        LOWER(username) = LOWER($1)
      LIMIT
        1;`,
      values: [username],
    });
    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema",
        action: "Verifique se o username está digitado corretamente",
      });
    }
    return result.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
