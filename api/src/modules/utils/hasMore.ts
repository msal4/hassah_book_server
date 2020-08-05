import { PagniationArgs } from "@api/modules/shared/types/PaginationArgs";

export function hasMore(args: PagniationArgs, total: number): boolean {
  return args.skip + args.take < total;
}
