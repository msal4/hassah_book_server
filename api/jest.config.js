module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@api/(.*)$": ["<rootDir>/src/$1"],
  },
};
