import { ContextFunction } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { verify } from "jsonwebtoken";

import { RequestContext } from "@api/modules/types/RequestContext";
import { createLoaders } from "@api/utils/loaders";
import { accessSecret, parseAuthorizationToken } from "@api/modules/utils/auth";
import { JwtAccessPayload } from "@api/modules/types/JwtPayload";

export const getContext: ContextFunction<ExpressContext, RequestContext> = ({ req, res }) => {
  const context = { req, res, loaders: createLoaders() };

  const token = parseAuthorizationToken(req);
  if (!token.length) return context;

  try {
    const payload = verify(token, accessSecret) as JwtAccessPayload;
    return { ...context, payload };
  } catch {}

  return context;
};
