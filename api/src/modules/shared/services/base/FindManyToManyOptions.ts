import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";

export interface FindManyToManyOptions {
  parentId: string;
  relationName: string;
  paginationArgs?: PagniationArgs;
}
