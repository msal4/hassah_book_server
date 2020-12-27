import { Resolver, Mutation, Arg, Ctx, Authorized, ID, Query, Args } from "type-graphql";

import { AdminService } from "@api/modules/admin/admin/Admin.service";
import { AdminLoginInput } from "@api/modules/admin/admin/AdminLoginInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Admin } from "@api/entity/Admin";
import { AdminRegisterInput } from "@api/modules/admin/admin/AdminRegisterInput";
import { Roles } from "@api/modules/utils/auth";
import { AdminUpdateInput } from "@api/modules/admin/admin/AdminUpdateInput";
import { PaginatedAdminResponse } from "@api/modules/types/PaginatedResponse";
import { FilterArgs } from "@api/modules/types/FilterArgs";

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Authorized(Roles.Admin)
  @Query(() => PaginatedAdminResponse)
  admins(@Args() args: FilterArgs): Promise<PaginatedAdminResponse> {
    return this.adminService.findAll(args);
  }

  @Mutation(() => LoginResponse)
  adminLogin(@Ctx() { res }: RequestContext, @Arg("data") data: AdminLoginInput): Promise<LoginResponse> {
    return this.adminService.login(res, data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Admin)
  adminRegister(@Arg("data") data: AdminRegisterInput): Promise<Admin> {
    return this.adminService.register(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  adminUpdate(@Ctx() { payload }: RequestContext, @Arg("data") data: AdminUpdateInput): Promise<boolean> {
    return this.adminService.update({ ...data, id: data.id ?? payload?.userId });
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  adminDelete(@Arg("id", () => ID) id: string): Promise<boolean> {
    return this.adminService.delete(id);
  }
}
