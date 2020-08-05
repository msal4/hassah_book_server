import { FindManyOptions } from "typeorm";

import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";

export type FindAllOptions<T> = PagniationArgs & FindManyOptions<T>;
