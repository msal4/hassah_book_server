import { lowerCamelCase } from "@api/modules/utils/string";

describe("String Utils", () => {
  describe("lowerCamelCase", () => {
    it("first character to lower case", () => {
      expect(lowerCamelCase("ThisIsAString")).toBe("thisIsAString");
    });
    it("empty string", () => {
      expect(lowerCamelCase("")).toBe("");
    });
    it("undefined", () => {
      expect(lowerCamelCase(undefined as any)).toBe("");
    });
  });
});
