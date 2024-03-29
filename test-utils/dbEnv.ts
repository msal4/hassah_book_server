import { getConnection, createConnection, getRepository } from "typeorm";

import { ormconfig } from "@api/test-utils/ormconfig";

beforeAll(async () => {
  await createConnection({ ...ormconfig, synchronize: false, dropSchema: false });
});

afterEach(async () => {
  try {
    for (const entity of getConnection().entityMetadatas) {
      await getRepository(entity.name).query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  } catch (err) {
    console.log(`ERROR: Cleaning test database: ${err}`);
  }
});

afterAll(async () => {
  await getConnection().close();
});
