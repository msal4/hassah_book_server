import { FilterArgs } from "@api/modules/types/FilterArgs";

export interface FindManyToManyOptions {
  relationName: string;
  childId: string;
  relations?: string[];
  filterArgs?: FilterArgs;
}
