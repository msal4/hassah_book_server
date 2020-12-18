import { Service } from "typedi";
import { Response } from "express";

import { Admin } from "@api/entity/Admin";
import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { sendRefreshTokenCookie, createRefreshToken, createAccessToken } from "@api/modules/utils/auth";
import { AdminRegisterInput } from "@api/modules/admin/admin/AdminRegisterInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";

@Service()
export class AdminService {
  register(data: AdminRegisterInput): Promise<Admin> {
    return Admin.create(data).save();
  }

  async login(res: Response, { email, password }: AdminLoginInput): Promise<LoginResponse> {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      throw new Error("no admin found");
    }

    const valid = await admin.validatePassword(password);
    if (!valid) {
      throw new Error("password is incorrect");
    }

    sendRefreshTokenCookie(res, createRefreshToken(admin));

    return { accessToken: createAccessToken(admin) };
  }
}
