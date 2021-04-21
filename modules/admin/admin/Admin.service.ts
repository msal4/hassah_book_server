import { Service } from "typedi";
import { hash } from "bcryptjs";

import { Admin } from "@api/entity/Admin";
import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { AdminRegisterInput } from "@api/modules/admin/admin/AdminRegisterInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { BaseService } from "@api/modules/services/Base.service";
import { PASSWORD_SALT } from "@api/modules/constants/user";
import { AdminUpdateInput } from "@api/modules/admin/admin/AdminUpdateInput";
import { createTokens } from "@api/modules/utils/auth";

@Service()
export class AdminService extends BaseService<Admin> {
  register(data: AdminRegisterInput): Promise<Admin> {
    return Admin.create(data).save();
  }

  async login({ email, password }: AdminLoginInput): Promise<LoginResponse> {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      throw new Error("no admin found");
    }

    const valid = await admin.validatePassword(password);
    if (!valid) {
      throw new Error("password is incorrect");
    }

    return createTokens(admin);
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
