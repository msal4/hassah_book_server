import "reflect-metadata";
import "dotenv/config";

import { ApolloServer, ApolloServerExpressConfig } from "apollo-server-express";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { createSchema } from "@api/utils/createSchema";
import { refreshToken } from "@api/utils/refreshToken";
import { RequestContext } from "@api/modules/types/RequestContext";
import { createLoaders } from "@api/utils/loaders";
import { queryComplexityPlugin } from "@api/utils/queryComplexity.plugin";

async function bootstrap() {
  // Create typeorm connection using the default configuration in .env .
  await createConnection();

  const schema = await createSchema();

  const app = express();
  app.use(cookieParser());
  app.use(cors());
  app.use(express.json());
  app.set("trust proxy", 1);
  app.get("/", (_req, res) => res.send('<a href="/graphql">Graphql Playground</a>'));
  app.post("/refresh_token", refreshToken);

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, loaders: createLoaders() } as RequestContext),
    plugins: [queryComplexityPlugin(schema)],
  } as ApolloServerExpressConfig);
  apolloServer.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

bootstrap();
