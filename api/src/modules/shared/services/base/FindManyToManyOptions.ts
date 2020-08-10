import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";

export interface FindManyToManyOptions {
  tableName: string;
  relationName: string;
  parentId: string;
  relations?: string[];
  paginationArgs?: PagniationArgs;
}
