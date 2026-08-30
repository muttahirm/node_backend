import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    env: {
      NODE_ENV: "test",
      PORT: "3001",
      MONGO_URI: "mongodb://localhost:27017/placeholder_test",
      JWT_SECRET: "placeholder_secret",
      JWT_EXPIRES_IN: "1h",
      BCRYPT_SALT_ROUNDS: "10",
      CORS_ORIGIN: "*",
      LOG_LEVEL: "silent",
        },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/index.ts"],
    },
  },
});
