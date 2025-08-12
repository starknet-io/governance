import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig, defineConfig, loadEnv } from "vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("sentry token chuj", env.VITE_APP_SENTRY_AUTH_TOKEN);
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
      include: ["@snapshot-labs/sx"],
      esbuildOptions: {
        format: "esm", // or 'cjs' depending on the package
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
      ],
    },
  } as UserConfig;
});
