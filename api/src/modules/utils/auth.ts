import { sign, verify } from "jsonwebtoken";
import { Response } from "express";
import { AuthChecker } from "type-graphql";

import { BaseUser } from "@api/entity/base/BaseUser";
import { RequestContext } from "@api/modules/types/RequestContext";
import { JwtAccessPayload } from "@api/modules/types/JwtPayload";
import { Admin } from "@api/entity/Admin";
import { User } from "@api/entity/User";
import { google } from "googleapis";

export enum Roles {
  Admin = "Admin",
  Owner = "Owner",
  User = "User",
}

const checkRoles = async (id: string, roles: Roles[], root: any): Promise<boolean> => {
  for (const role of roles) {
    if (role === Roles.Admin) {
      const admin = await Admin.findOne({ where: { id } });
      if (admin) return true;
    } else if (role === Roles.User) {
      const user = await User.findOne({ where: { id } });
      if (user) return true;
    } else if (role === Roles.Owner) {
      const user = await User.findOne({ where: { id } });
      const authorized = "id" in root && user!.id === root.id;
      if (authorized) return true;
    }
  }

  return false;
};

export const authChecker: AuthChecker<RequestContext, Roles> = async ({ root, context }, roles) => {
  const authorization = context.req.headers.authorization;
  if (!authorization) {
    return false;
  }

  try {
    const token = authorization.split(" ")[1];
    context.payload = verify(token, getAccessSecret()) as JwtAccessPayload;
    return await checkRoles(context.payload.userId, roles, root);
  } catch (err) {
    return false;
  }
};

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

export const relyingparty = google.identitytoolkit({
  version: "v3",
  auth: process.env.GOOGLE_CLOUD_API_KEY!,
}).relyingparty;
