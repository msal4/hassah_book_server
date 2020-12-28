import faker from "faker";

import { normalizePhone } from "@api/modules/utils/normalizePhone";

describe("Normalize phone", () => {
  it("normalize numbers starting with +96477", () => {
    const phone = faker.phone.phoneNumber("+96477########");
    expect(normalizePhone(phone)).toBe("+964" + phone.substr(4));
  });
  it("normalize numbers starting with 0096477", () => {
    const phone = faker.phone.phoneNumber("0096477########");
    expect(normalizePhone(phone)).toBe("+964" + phone.substr(5));
  });
  it("normalize numbers starting with 077", () => {
    const phone = faker.phone.phoneNumber("077########");
    expect(normalizePhone(phone)).toBe("+964" + phone.substr(1));
  });
});
