import "reflect-metadata";
import "dotenv/config";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";

import { RegisterResolver } from "src/modules/user/Register";
import { HelloResover } from "./modules/user/Hello";
import { LoginReslover } from "./modules/user/Login";
import {
  getRefreshSecret,
  createAccessToken,
  sendRefreshTokenCookie,
  createRefreshToken,
} from "./modules/user/auth";
import { User } from "./entity/User";
import { JwtRefreshPayload } from "./modules/types/JwtPayload";

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginReslover, HelloResover],
  });
  const app = express();

  app.use(cookieParser());

  app.get("/", (_req, res) => res.send("hi"));
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.skal as string;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    try {
      const payload = verify(token, getRefreshSecret()) as JwtRefreshPayload;
      const user = await User.findOne(payload?.userId);
      if (!user) {
        return res.send({ ok: false, accessToken: "" });
      }

      if (payload.tokenVersion !== user.tokenVersion) {
        return res.send({ ok: false, accessToken: "" });
      }

      sendRefreshTokenCookie(res, createRefreshToken(user));

      return res.send({ ok: true, accessToken: createAccessToken(user) });
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("listening on port 4000");
  });
};

main();
