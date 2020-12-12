// important for migrations to work.
require("ts-node/register");
require("tsconfig-paths/register");

import { createConnection, getConnection } from "typeorm";
import { ormconfig } from "@api/test-utils/ormconfig";

export default async () => {
  const startTime = Date.now();
  // to avoid establishing a connection if it already exists.
  try {
    await createConnection(ormconfig);
  } catch {}
  await getConnection().runMigrations();
  const finishTime = Date.now();
  console.log(`Connected in ${finishTime - startTime}ms`);
};
