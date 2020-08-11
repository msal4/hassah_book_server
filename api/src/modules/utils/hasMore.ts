import { FilterArgs } from "@api/modules/shared/types/FilterArgs";

export function hasMore(args: FilterArgs, total: number): boolean {
  return args.skip + args.take < total;
}
