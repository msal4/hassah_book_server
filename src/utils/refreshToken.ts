import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { refreshSecret, createTokens } from "@api/modules/utils/auth";
import { JwtRefreshPayload } from "@api/modules/types/JwtPayload";
import { User } from "@api/entity/User";
import { Admin } from "@api/entity/Admin";
import { BaseUser } from "@api/entity/base/BaseUser";

export async function refreshToken(req: Request, res: Response) {
  if (!req.body) {
    return res.status(401).send({ ok: false });
  }

  const token = req.body.token as string;
  if (!token) {
    return res.status(401).send({ ok: false });
  }

  try {
    const payload = verify(token, refreshSecret) as JwtRefreshPayload;
    let user: BaseUser | undefined = await User.findOne(payload?.userId);
    if (!user) {
      user = await Admin.findOne(payload?.userId);
      if (!user) {
        return res.status(401).send({ ok: false });
      }
    }

    // Checks if the token is invalidated.
    if (payload.tokenVersion !== user.tokenVersion) {
      return res.status(401).send({ ok: false });
    }

    return res.send({ ok: true, ...createTokens(user) });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ ok: false });
  }
}
