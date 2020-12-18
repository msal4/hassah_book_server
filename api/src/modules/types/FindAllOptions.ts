import { ObjectLiteral } from "typeorm";

import { FilterArgs } from "@api/modules/types/FilterArgs";

export interface FindAllOptions extends FilterArgs {
  where?: ObjectLiteral | string;
}
