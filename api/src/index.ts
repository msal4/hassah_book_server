import "reflect-metadata";
import "dotenv/config";

import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";

import { createSchema } from "@api/utils/createSchema";
import { refreshToken } from "@api/utils/refreshToken";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { createLoaders } from "@api/utils/loaders";

const PORT = 4000;

const main = async () => {
  await createConnection();
  const schema = await createSchema();

  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => res.send('<a href="/graphql">Graphql PlayGround</a>'));
  app.post("/refresh_token", refreshToken);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, loaders: createLoaders() } as RequestContext),
  });
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
};

main();
