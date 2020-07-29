import { Connection } from "typeorm";
import faker from "faker";

import { testConn } from "@api/test-utils/testConn";
import { gCall } from "@api/test-utils/gCall";
import { User } from "@api/entity/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});

afterAll(async () => {
  await conn.close();
});

const registerMutation = `
mutation Register($data: RegisterInput!){
  register(
    data: $data
  ) {
    id
    name
    phone
    address
  }
}
`;

describe("Register", () => {
  it("create user", async () => {
    const user = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber("077########"),
      password: faker.internet.password(),
    };

    const data = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    });

    const phone = user.phone.substr(1);

    expect(data).toMatchObject({
      data: {
        register: {
          name: user.name,
          phone,
          address: null,
        },
      },
    });

    const dbUser = await User.findOne({ where: { phone } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.name).toBe(user.name);
    expect(dbUser?.phone).toBe(phone);
    expect(dbUser?.address).toBe(null);
  });
});
