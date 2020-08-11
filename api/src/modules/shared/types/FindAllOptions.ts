import { FindManyOptions } from "typeorm";

import { FilterArgs } from "@api/modules/shared/types/FilterArgs";

export type FindAllOptions<T> = FilterArgs & FindManyOptions<T>;
