import { Service } from "typedi";
import { getRepository } from "typeorm";

import { BaseService } from "@api/modules/shared/services/Base.service";
import { UserRequest } from "@api/entity/UserRequest";

@Service()
export class UserRequestService extends BaseService<UserRequest> {
  constructor() {
    super(getRepository(UserRequest));
  }
}
