import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { AdminService } from "@api/modules/admin/admin/Admin.service";
import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { LoginResponse } from "@api/modules/shared/types/LoginResponse";
import { RequestContext } from "@api/modules/shared/types/RequestContext";
import { Admin } from "@api/entity/Admin";
import { AdminRegisterInput } from "@api/modules/admin/admin/AdminRegisterInput";

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Mutation(() => LoginResponse)
  adminLogin(@Ctx() { res }: RequestContext, @Arg("data") data: AdminLoginInput): Promise<LoginResponse> {
    return this.adminService.login(res, data);
  }

  // TODO: only an authorized aministrator can create another admin/moderator account.
  @Mutation(() => Admin)
  adminRegister(@Arg("data") data: AdminRegisterInput): Promise<Admin> {
    return this.adminService.register(data);
  }
}
