export function hasMore(args: { skip: number; take: number }, total: number): boolean {
  return args.skip + args.take < total;
}
