import { firstCharToLowerCase } from "@api/modules/utils/string";

describe("String Utils", () => {
  describe("firstCharToLowerCase", () => {
    it("first character to lower case", () => {
      expect(firstCharToLowerCase("ThisIsAString")).toBe("thisIsAString");
    });
    it("empty string", () => {
      expect(firstCharToLowerCase("")).toBe("");
    });
    it("undefined", () => {
      expect(firstCharToLowerCase(undefined as any)).toBe("");
    });
  });
});
