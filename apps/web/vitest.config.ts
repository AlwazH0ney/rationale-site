import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["components/**/*.{ts,tsx}", "hooks/**/*.ts", "lib/**/*.ts"],
      // 3D is verified visually (WebGL is not available in jsdom).
      exclude: ["components/three/**"],
      reporter: ["text-summary", "text"],
    },
  },
});
