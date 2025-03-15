import { Client } from "pg";
import { ServicerError } from "./errors.js";

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (err) {
    const servicerErrorObject = new ServicerError({
      cause: err,
      message: "Erro na conexão ou na quary",
    });

    throw servicerErrorObject;
  } finally {
    client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();
  return client;
}
const database = {
  query,
  getNewClient,
};
export default database;