import { sign } from "jsonwebtoken";

import { User } from "src/entity/User";
import { Response } from "express";

export const getAccessSecret = () => process.env.JWT_ACCESS_SECRET!;
export const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET!;

export const createAccessToken = (user: User) =>
  sign({ userId: user.id }, getAccessSecret(), { expiresIn: "15m" });

export const createRefreshToken = (user: User) =>
  sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    getRefreshSecret(),
    { expiresIn: "1w" }
  );

export const sendRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("skal", token, { httpOnly: true });
};
