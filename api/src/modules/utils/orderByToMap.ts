import { OrderByMap, OrderType } from "@api/modules/shared/types/FilterArgs";

export function orderByToMap<T>(order?: OrderByMap[]) {
  return order?.reduce(
    (acc, map) => ({ ...acc, [map.field]: map.order }),
    {} as { [p in keyof T]: OrderType }
  );
}
