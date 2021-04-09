import { sign, verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { google } from "googleapis";
import { Request } from "express";

import { BaseUser } from "@api/entity/base/BaseUser";
import { RequestContext } from "@api/modules/types/RequestContext";
import { JwtAccessPayload } from "@api/modules/types/JwtPayload";
import { Admin } from "@api/entity/Admin";
import { User } from "@api/entity/User";

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

export const parseAuthorizationToken = (req: Request) => {
  const authorization = req.headers.authorization ?? "";
  return authorization.split(" ")[1] ?? "";
};

export const authChecker: AuthChecker<RequestContext, Roles> = async ({ root, context }, roles) => {
  const token = parseAuthorizationToken(context.req);

  try {
    context.payload = verify(token, accessSecret) as JwtAccessPayload;
    return await checkRoles(context.payload.userId, roles, root);
  } catch (err) {
    return false;
  }
};

export const accessSecret: string = process.env.JWT_ACCESS_SECRET ?? "testsecretkey";
export const refreshSecret: string = process.env.JWT_REFRESH_SECRET ?? "anothertestsecretkey";

export const createAccessToken = (user: BaseUser) =>
  sign({ userId: user.id }, accessSecret, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME ?? "15m" });

export const createRefreshToken = (user: BaseUser) =>
  sign({ userId: user.id, tokenVersion: user.tokenVersion }, refreshSecret, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME ?? "8w",
  });

export const createTokens = (user: BaseUser) => ({
  refreshToken: createRefreshToken(user),
  accessToken: createAccessToken(user),
});

export const relyingParty = google.identitytoolkit({
  version: "v3",
  auth: process.env.GOOGLE_CLOUD_API_KEY!,
}).relyingparty;
