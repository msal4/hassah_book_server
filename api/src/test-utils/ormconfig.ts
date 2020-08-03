import { ConnectionOptions } from "typeorm";
import { join } from "path";

export const ormconfig: ConnectionOptions = {
  name: "default",
  type: "postgres",
  host: "localhost",
  username: "msal",
  password: "postgres",
  database: "hassahbook-test",
  port: 5432,
  synchronize: true,
  dropSchema: true,
  entities: [join(__dirname, "../entity/*.*")],
};
