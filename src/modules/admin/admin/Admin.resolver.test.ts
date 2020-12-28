import faker from "faker";
import { factory, useSeeding } from "typeorm-seeding";

import { gCall } from "@api/test-utils/gCall";
import { mockRequestContext } from "@api/test-utils/mockRequestContext";
import { Admin } from "@api/entity/Admin";
import { createMockRequest } from "@api/test-utils/createMockRequest";

beforeAll(async () => {
  await useSeeding();
});

const loginMutation = `
mutation AdminLogin($data: AdminLoginInput!){
  adminLogin(data: $data) {
    accessToken
  }
}
`;

const updateMutation = `
mutation AdminUpdate($data: AdminUpdateInput!){
  adminUpdate(data: $data)
}
`;

describe("Admin Login", () => {
  it("login existing admin", async () => {
    const data = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await Admin.create(data).save();

    const result = await gCall({
      source: loginMutation,
      variableValues: { data: { email: data.email, password: data.password } },
      contextValue: mockRequestContext(),
    });

    expect(result.data?.adminLogin?.accessToken).toBeDefined();
    expect(result.data?.adminLogin?.accessToken.length).toBeGreaterThan(0);
  });

  it("login non-existing admin", async () => {
    const data = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await gCall({
      source: loginMutation,
      variableValues: { data: { email: data.email, password: data.password } },
      contextValue: mockRequestContext(),
    });

    expect(result.data?.login?.accessToken).toBeUndefined();
  });
});

describe("Admin Update", () => {
  it("update the logged in admin", async () => {
    const admin = await factory(Admin)().create();
    const updatedName = "Updated Name";

    const result = await gCall({
      source: updateMutation,
      variableValues: { data: { name: updatedName } },
      contextValue: mockRequestContext({ req: createMockRequest(admin) }),
    });

    await admin.reload();

    expect(result.data?.adminUpdate).toBeTruthy();
    expect(admin.name).toBe(updatedName);
  });

  it("update another admin", async () => {
    const admin = await factory(Admin)().create();
    const adminToUpdate = await factory(Admin)().create();
    const updatedName = "Updated Name";

    const result = await gCall({
      source: updateMutation,
      variableValues: { data: { id: adminToUpdate.id, name: updatedName } },
      contextValue: mockRequestContext({ req: createMockRequest(admin) }),
    });

    await adminToUpdate.reload();

    expect(result.data?.adminUpdate).toBeTruthy();
    expect(adminToUpdate.name).toBe(updatedName);
  });

  it("empty string field", async () => {
    const admin = await factory(Admin)().create();
    const adminToUpdate = await factory(Admin)().create();

    const result = await gCall({
      source: updateMutation,
      variableValues: { data: { id: adminToUpdate.id, name: "" } },
      contextValue: mockRequestContext({ req: createMockRequest(admin) }),
    });

    const name = adminToUpdate.name;
    await adminToUpdate.reload();

    expect(result.data).toBeNull();
    expect(adminToUpdate.name).toBe(name);
  });
});
