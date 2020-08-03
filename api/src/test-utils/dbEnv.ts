import { getConnection, createConnection } from "typeorm";

import { ormconfig } from "@api/test-utils/ormconfig";

beforeAll(async () => {
  await createConnection({ ...ormconfig, synchronize: false, dropSchema: false });
});
afterAll(async () => {
  await getConnection().close();
});
