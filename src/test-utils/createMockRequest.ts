import { mockRequest } from "mock-req-res";

import { BaseUser } from "@api/entity/base/BaseUser";
import { createAccessToken } from "@api/modules/utils/auth";

export function createMockRequest(user?: BaseUser) {
  const req = mockRequest();
  if (user) {
    req.headers.authorization = `bearer ${createAccessToken(user)}`;
  }
  return req;
}
