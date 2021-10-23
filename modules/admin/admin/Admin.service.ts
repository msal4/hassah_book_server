import { Service } from "typedi";
import { hash } from "bcryptjs";

import { Admin } from "@api/entity/Admin";
import { LoginAdminInput } from "@api/modules/admin/admin/LoginAdminInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { BaseService } from "@api/modules/services/Base.service";
import { PASSWORD_SALT } from "@api/modules/constants/user";
import { UpdateAdminInput } from "@api/modules/admin/admin/UpdateAdminInput";
import { createTokens } from "@api/modules/utils/auth";

@Service()
export class AdminService extends BaseService<Admin> {
  async login({ email, password }: LoginAdminInput): Promise<LoginResponse> {
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

  async update(data: UpdateAdminInput): Promise<boolean> {
    try {
      const password = data.password && (await hash(data.password, PASSWORD_SALT));
      await this.repository.save({ ...data, password });
      return true;
    } catch {
      return false;
    }
  }
}
