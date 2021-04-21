import { Service } from "typedi";

import { BaseService } from "@api/modules/services/Base.service";
import { UserRequest } from "@api/entity/UserRequest";

@Service()
export class UserRequestService extends BaseService<UserRequest> {
  relations = ["user"];
}
