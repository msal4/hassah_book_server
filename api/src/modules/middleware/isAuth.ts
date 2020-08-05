import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { getAccessSecret } from "@api/modules/user/auth";
import { JwtAccessPayload } from "@api/modules/shared/types/JwtPayload";

export const isAuth: MiddlewareFn<RequestContext> = ({ context }, next) => {
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
