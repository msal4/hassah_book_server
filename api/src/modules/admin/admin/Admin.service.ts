import { Service } from "typedi";
import { Response } from "express";

import { Admin } from "@api/entity/Admin";
import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { sendRefreshTokenCookie, createRefreshToken, createAccessToken } from "@api/modules/utils/auth";
import { AdminRegisterInput } from "@api/modules/admin/admin/AdminRegisterInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { BaseService } from "@api/modules/services/Base.service";
import { hash } from "bcryptjs";
import { PASSWORD_SALT } from "@api/modules/constants/user";
import { AdminUpdateInput } from "@api/modules/admin/admin/AdminUpdateInput";

@Service()
export class AdminService extends BaseService<Admin> {
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

  async update(data: AdminUpdateInput): Promise<boolean> {
    try {
      const password = data.password && (await hash(data.password, PASSWORD_SALT));
      await this.repository.save({ ...data, password });
      return true;
    } catch {
      return false;
    }
  }
}
