import { OrderByMap, OrderType } from "@api/modules/shared/types/FilterArgs";

export function orderByToMap<T>(order?: OrderByMap[], ...prefixes: string[]) {
  return order?.reduce(
    (acc, map) => ({ ...acc, [`${prefixes.join("")}${map.field}`]: map.order }),
    {} as { [p in keyof T]: OrderType }
  );
}
