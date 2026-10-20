import { isBuiltin } from "node:module";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { server: "src/index.ts" },
  platform: "node",
  target: "node22.18",
  format: "esm",
  clean: true,
  hash: false,
  outputOptions: {
    codeSplitting: false,
  },
  deps: {
    onlyBundle: false,
    alwaysBundle: (id) => {
      // Don't bundle swagger-ui-express - it needs to access its own static files
      if (id.includes('swagger-ui-express') || id.includes('swagger-jsdoc')) {
        return false;
      }
      return !isBuiltin(id);
    },
  },
});
