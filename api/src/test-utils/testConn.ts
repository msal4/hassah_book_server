import { createConnection } from "typeorm";
import { join } from "path";

export const testConn = (drop = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    username: "msal",
    password: "postgres",
    database: "hassahbook-test",
    port: 5432,
    synchronize: drop,
    dropSchema: drop,
    entities: [join(__dirname, "../entity/*.*")],
  });
};
