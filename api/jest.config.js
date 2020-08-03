module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@api/(.*)$": ["<rootDir>/src/$1"],
  },
  globalSetup: "./src/test-utils/setup.ts",
  setupFilesAfterEnv: ["./src/test-utils/dbEnv.ts"],
};
