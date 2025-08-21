import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig, defineConfig, loadEnv } from "vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    publicDir: path.resolve(__dirname, "../../public"),
    plugins: [
      tsconfigPaths(),
      react(),
      ssr(),
      nodePolyfills(),
      sentryVitePlugin({
        org: "myown-40",
        project: "gov",
        authToken: env.VITE_APP_SENTRY_AUTH_TOKEN,
      }),
    ],

    optimizeDeps: {
      exclude: ["starknet"],
      esbuildOptions: {
        format: "esm",
        target: "esnext",
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development",
      ),
    },
    resolve: {
      conditions: ["import", "module", "default"],
      mainFields: ["module", "main"],
      alias: {
        starknet: path.resolve(
          __dirname,
          "../../node_modules/starknet/dist/index.mjs",
        ),
      },
    },
    server: {
      fs: {
        allow: [".."],
      },
    },

    build: {
      emptyOutDir: true,
      sourceMap: true,
    },
    ssr: {
      target: "node",
      noExternal: [
        "@apollo/client",
        "color-hash",
        "react-use",
        "react-syntax-highlighter",
        "@snapshot-labs/sx",
        "starknet",
      ],
    },
  } as UserConfig;
});
