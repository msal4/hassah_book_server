import { hasMore } from "./hasMore";

describe("Has More", () => {
  it("more than total", () => {
    const got = hasMore({ skip: 10, take: 20 }, 12);
    expect(got).toBeFalsy();
  });

  it("less than total", () => {
    const got = hasMore({ skip: 10, take: 1 }, 12);
    expect(got).toBeTruthy();
  });

  it("equal to total", () => {
    const got = hasMore({ skip: 10, take: 2 }, 12);
    expect(got).toBeFalsy();
  });
});
