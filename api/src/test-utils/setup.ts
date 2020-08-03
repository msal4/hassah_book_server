// important for migrations to work.
require("ts-node/register");
require("tsconfig-paths/register");

import { createConnection } from "typeorm";
import { ormconfig } from "@api/test-utils/ormconfig";

export default async () => {
  const startTime = Date.now();
  // to avoid establishing a connection if it already exist.
  try {
    await createConnection(ormconfig);
  } catch {}
  // TODO: run migrations here once I start using them.
  // await connection.runMigrations()
  const finishTime = Date.now();
  console.log(`Connected in ${finishTime - startTime}ms`);
};
