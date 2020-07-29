import { Connection } from "typeorm";

import { testConn } from "@api/test-utils/testConn";
import { gCall } from "@api/test-utils/gCall";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation {
  register(
    data: { 
      name: "Salori hi",
      phone: "07705983833",
      password: "soyaboyno" 
    }
  ) {
    id
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = await gCall({ source: registerMutation });
    console.log(user);
  });
});
