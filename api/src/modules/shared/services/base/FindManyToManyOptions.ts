import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";

export interface FindManyToManyOptions {
  relationName: string;
  childId: string;
  relations?: string[];
  paginationArgs?: PagniationArgs;
}
