import { Resolver, Mutation, Arg, Ctx, Authorized, ID, Query, Args } from "type-graphql";

import { AdminService } from "@api/modules/admin/admin/Admin.service";
import { LoginAdminInput } from "@api/modules/admin/admin/LoginAdminInput";
import { LoginResponse } from "@api/modules/types/LoginResponse";
import { RequestContext } from "@api/modules/types/RequestContext";
import { Admin } from "@api/entity/Admin";
import { CreateAdminInput } from "@api/modules/admin/admin/CreateAdminInput";
import { Roles } from "@api/modules/utils/auth";
import { UpdateAdminInput } from "@api/modules/admin/admin/UpdateAdminInput";
import { PaginatedAdminResponse } from "@api/modules/types/PaginatedResponse";
import { FilterArgs } from "@api/modules/types/FilterArgs";

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Authorized(Roles.Admin)
  @Query(() => Admin)
  admin(@Arg("id", () => ID) id: string): Promise<Admin | null> {
    return this.adminService.findOne({ where: { id } });
  }

  @Authorized(Roles.Admin)
  @Query(() => PaginatedAdminResponse)
  admins(@Args() args: FilterArgs): Promise<PaginatedAdminResponse> {
    return this.adminService.findAll(args);
  }

  @Mutation(() => LoginResponse)
  loginAdmin(@Arg("data") data: LoginAdminInput): Promise<LoginResponse> {
    return this.adminService.login(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Admin)
  createAdmin(@Arg("data") data: CreateAdminInput): Promise<Admin> {
    return this.adminService.create(data);
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  updateAdmin(@Ctx() { payload }: RequestContext, @Arg("data") data: UpdateAdminInput): Promise<boolean> {
    return this.adminService.update({ ...data, id: data.id ?? payload?.userId });
  }

  @Authorized(Roles.Admin)
  @Mutation(() => Boolean)
  deleteAdmin(@Arg("id", () => ID) id: string): Promise<boolean> {
    return this.adminService.delete(id);
  }
}
