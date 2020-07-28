import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { ApiContext } from "src/modules/types/ApiContext";
import { getAccessSecret } from "src/modules/user/auth";
import { JwtAccessPayload } from "src/modules/types/JwtPayload";

export const isAuth: MiddlewareFn<ApiContext> = ({ context }, next) => {
  const authorization = context.req.headers.authorization;
  if (!authorization) {
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    context.payload = verify(token, getAccessSecret()) as JwtAccessPayload;
  } catch {
    throw new Error("not authenticated");
  }

  return next();
};
