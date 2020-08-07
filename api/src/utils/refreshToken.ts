import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import {
  sendRefreshTokenCookie,
  createAccessToken,
  createRefreshToken,
  getRefreshSecret,
} from "@api/modules/utils/auth";
import { JwtRefreshPayload } from "@api/modules/shared/types/JwtPayload";
import { User } from "@api/entity/User";

export async function refreshToken(req: Request, res: Response) {
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
}
