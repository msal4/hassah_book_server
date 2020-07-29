import "reflect-metadata";
import "dotenv/config";

import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";

import {
  getRefreshSecret,
  createAccessToken,
  sendRefreshTokenCookie,
  createRefreshToken,
} from "src/modules/user/auth";
import { User } from "src/entity/User";
import { JwtRefreshPayload } from "src/modules/types/JwtPayload";
import { createSchema } from "src/utils/createSchema";

const main = async () => {
  await createConnection();
  const schema = await createSchema();

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

      // Checks if the token is invalidated.
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
