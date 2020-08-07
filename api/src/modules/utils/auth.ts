import { sign } from "jsonwebtoken";
import { Response } from "express";

import { BaseUser } from "@api/entity/shared/BaseUser";

// TODO: check whether the environment is development or production and set the secret
// based on that instead of just hardcoding it.
export const getAccessSecret = () => process.env.JWT_ACCESS_SECRET ?? "testsecretkey";
export const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET ?? "anothertestsecretkey";

export const createAccessToken = (user: BaseUser) =>
  sign({ userId: user.id }, getAccessSecret(), { expiresIn: "15m" });

export const createRefreshToken = (user: BaseUser) =>
  sign({ userId: user.id, tokenVersion: user.tokenVersion }, getRefreshSecret(), {
    expiresIn: "8w",
  });

export const sendRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("skal", token, { httpOnly: true });
};
