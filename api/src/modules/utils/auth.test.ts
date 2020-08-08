import { mockRequest, mockResponse, RequestOutput } from "mock-req-res";
import { factory, useSeeding } from "typeorm-seeding";

import { authChecker, createAccessToken, Roles } from "@api/modules/utils/auth";
import { createLoaders } from "@api/utils/loaders";
import { BaseUser } from "@api/entity/shared/BaseUser";
import { User } from "@api/entity/User";
import { Admin } from "@api/entity/Admin";

beforeAll(async () => {
  await useSeeding();
});

const createRequest = async (user: BaseUser) => {
  const req = mockRequest();
  req.headers.authorization = `bearer ${createAccessToken(user)}`;
  return req;
};

const checkAuthorized = ({ req, root = {}, roles }: { req: RequestOutput; root?: any; roles: Roles[] }) =>
  authChecker(
    {
      context: { loaders: createLoaders(), req, res: mockResponse() },
      root,
      args: [],
      info: {} as any,
    },
    roles
  );

describe("Auth", () => {
  it("authorize user", async () => {
    const user = await factory(User)().create();
    const req = await createRequest(user);

    expect(await checkAuthorized({ req, roles: [Roles.User] })).toBeTruthy();
  });

  it("authorize owner", async () => {
    const user = await factory(User)().create();
    const req = await createRequest(user);

    expect(await checkAuthorized({ req, root: { id: user.id }, roles: [Roles.Owner] })).toBeTruthy();

    expect(await checkAuthorized({ req, roles: [Roles.Owner] })).toBeFalsy();
  });

  it("authorize admin", async () => {
    const admin = await factory(Admin)().create();
    const req = await createRequest(admin);

    expect(await checkAuthorized({ req, roles: [Roles.Admin] })).toBeTruthy();
  });

  it("authorize admin or owner", async () => {
    const admin = await factory(Admin)().create();
    const adminReq = await createRequest(admin);

    expect(await checkAuthorized({ req: adminReq, roles: [Roles.Admin, Roles.Owner] })).toBeTruthy();

    const owner = await factory(User)().create();
    const ownerReq = await createRequest(owner);

    expect(
      await checkAuthorized({ req: ownerReq, root: { id: owner.id }, roles: [Roles.Admin, Roles.Owner] })
    ).toBeTruthy();

    const anotherUser = await factory(User)().create();

    expect(
      await checkAuthorized({
        req: ownerReq,
        root: { id: anotherUser.id },
        roles: [Roles.Admin, Roles.Owner],
      })
    ).toBeFalsy();

    const user = await factory(User)().create();
    const userReq = await createRequest(user);

    expect(await checkAuthorized({ req: userReq, roles: [Roles.Admin, Roles.Owner] })).toBeFalsy();
  });
});
