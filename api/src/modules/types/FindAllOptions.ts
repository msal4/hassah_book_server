import { FindManyOptions } from "typeorm";

import { PagniationArgs } from "@api/modules/shared/PaginationArgs";

export type FindAllOptions<T> = PagniationArgs & FindManyOptions<T>;
