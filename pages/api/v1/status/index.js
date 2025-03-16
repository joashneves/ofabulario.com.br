import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandles);

async function getHandler(request, response) {
  const databaseName = process.env.POSTGRES_DB;
  const openedConnectionDatabase = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const openedConnectionDatabaseValue = openedConnectionDatabase.rows[0].count;
  const versionDatabase = await database.query("SHOW server_version;");
  const versionDatabaseValue = versionDatabase.rows[0].server_version;

  const maxConnectionsDatabase = await database.query("SHOW max_connections;");
  const maxConnectionsDatabaseValue = parseInt(
    maxConnectionsDatabase.rows[0].max_connections,
  );

  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: versionDatabaseValue,
        max_connections: maxConnectionsDatabaseValue,
        opened_connection: openedConnectionDatabaseValue,
      },
    },
  });
}
