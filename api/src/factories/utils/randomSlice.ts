import faker from "faker";

export const randomSlice = <T>(arr: Array<T>) => {
  const max = faker.random.number(arr.length);
  const min = arr.length - max;
  return arr.slice(min, max);
};
