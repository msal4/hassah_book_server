import { FindManyOptions } from "typeorm";

import { FilterArgs } from "@api/modules/types/FilterArgs";

export type FindAllOptions<T> = FilterArgs & FindManyOptions<T>;
