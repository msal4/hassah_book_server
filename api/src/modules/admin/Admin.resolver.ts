import { Resolver, Mutation, Arg, Ctx, Authorized } from "type-graphql";

import { AdminService } from "@api/modules/admin/admin/Admin.service";
import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Admin } from "@api/entity/Admin";
import { AdminRegisterInput } from "@api/modules/admin/admin/AdminRegisterInput";
import { Roles } from "@api/modules/utils/auth";

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => LoginResponse)
  adminLogin(@Ctx() { res }: RequestContext, @Arg("data") data: AdminLoginInput): Promise<LoginResponse> {
    return this.adminService.login(res, data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Admin)
  adminRegister(@Arg("data") data: AdminRegisterInput): Promise<Admin> {
    return this.adminService.register(data);
  }
}
