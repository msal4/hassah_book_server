import { getRepository } from "typeorm";
import { Service } from "typedi";

import { Favorite } from "@api/entity/Favorite";
import { BaseService } from "@api/modules/shared/services/Base.service";

@Service()
export class FavoriteService extends BaseService<Favorite> {
  constructor() {
    super(getRepository(Favorite));
  }
}
