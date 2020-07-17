module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: [require.resolve("./jest-setup.ts")],
  globals: {
    "ts-jest": {
      packageJson: "<rootDir>/package.json",
    },
  },
};
