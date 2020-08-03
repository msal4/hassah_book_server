import faker from "faker";

import { gCall } from "@api/test-utils/gCall";
import { User } from "@api/entity/User";
import { mockRequestContext } from "@api/utils/mockRequestContext";

const loginMutation = `
mutation Login($data: LoginInput!){
  login(data: $data) {
    accessToken
  }
}
`;

describe("Login Resolver", () => {
  it("login user", async () => {
    const user = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber("077########"),
      password: faker.internet.password(),
      address: faker.address.streetAddress(true),
    };

    // create the user before login
    await User.create(user).save();

    const result = await gCall({
      source: loginMutation,
      variableValues: { data: { phone: user.phone, password: user.password } },
      contextValue: mockRequestContext(),
    });

    expect(result.data?.login?.accessToken).toBeDefined();
    expect(result.data?.login?.accessToken.length).toBeGreaterThan(0);
  });
});
