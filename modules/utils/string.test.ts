import dayjs from "dayjs";

import { formatFileName, lowerCamelCase } from "@api/modules/utils/string";

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

  describe("formatFileName", () => {
    const emptyLength = 17;
    const date = dayjs().format("YYYYMMDDHH");

    it("empty string", () => {
      const res = formatFileName("");
      expect(res).toHaveLength(emptyLength);
      expect(res.startsWith(date)).toBeTruthy();
    });

    it("without extension", () => {
      const name = "hello";
      const res = formatFileName(name);
      expect(res).toHaveLength(name.length + emptyLength);
      expect(res).toContain(name);
      expect(res.endsWith(name)).toBeTruthy();
      expect(res.startsWith(date)).toBeTruthy();
    });

    it("with extension", () => {
      const name = "hello.jpeg";
      const res = formatFileName(name);
      expect(res).toHaveLength(name.length + emptyLength);
      expect(res.startsWith(date)).toBeTruthy();
      expect(res.endsWith(name)).toBeTruthy();
    });

    it("non alphanumeric characters", () => {
      const name = "hi@there.jpeg";
      const expected = "hi-there.jpeg";
      const res = formatFileName(name);
      expect(res).toHaveLength(expected.length + emptyLength);
      expect(res.startsWith(date)).toBeTruthy();
      expect(res.endsWith(expected)).toBeTruthy();
    });

    it("length > 10", () => {
      const name = "hello@there.jpeg";
      const expected = "hello-ther.jpeg";
      const res = formatFileName(name);
      expect(res).toHaveLength(expected.length + emptyLength);
      expect(res.startsWith(date)).toBeTruthy();
      expect(res.endsWith(expected)).toBeTruthy();
    });
  });
});
