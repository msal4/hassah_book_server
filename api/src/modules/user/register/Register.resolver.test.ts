import faker from "faker";

import { gCall } from "@api/test-utils/gCall";
import { User } from "@api/entity/User";
import { mockRequestContext } from "@api/utils/mockRequestContext";

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

describe("Register Resolver", () => {
  it("create user", async () => {
    const user = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber("077########"),
      password: faker.internet.password(),
      address: faker.address.streetAddress(true),
    };

    const data = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
      contextValue: mockRequestContext(),
    });
    const phone = user.phone.substr(1);

    expect(data).toMatchObject({
      data: {
        register: {
          name: user.name,
          phone,
          address: user.address,
        },
      },
    });

    const dbUser = await User.findOne({ where: { phone } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.id).toBeDefined();
    expect(dbUser?.name).toBe(user.name);
    expect(dbUser?.phone).toBe(phone);
    expect(dbUser?.address).toBe(user.address);
  });
});
