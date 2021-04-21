module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@api/(.*)$": ["<rootDir>/$1"],
  },
  globalSetup: "./test-utils/setup.ts",
  setupFilesAfterEnv: ["./test-utils/dbEnv.ts"],
  testTimeout: 20000,
};
