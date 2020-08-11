import { OrderType } from "@api/modules/shared/types/FilterArgs";
import { orderByToMap } from "@api/modules/utils/orderByToMap";

describe("OrderBy to Map", () => {
  it("order by undefined to map", () => {
    expect(orderByToMap(undefined)).toBeUndefined();
  });

  it("order by empty to map", () => {
    expect(orderByToMap([])).toEqual({});
  });

  it("order by one to map", () => {
    const orderByMapList = [{ field: "test", order: OrderType.ASC }];
    expect(orderByToMap(orderByMapList)).toMatchObject({ test: "ASC" });
  });

  it("order by multiple to map", () => {
    const orderByMapList = [
      { field: "test", order: OrderType.ASC },
      { field: "test2", order: OrderType.DESC },
    ];
    expect(orderByToMap(orderByMapList)).toEqual({ test: "ASC", test2: "DESC" });
  });
});
