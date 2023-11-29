import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig, defineConfig } from "vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

export default defineConfig((env) => {
  return {
    publicDir: path.resolve(__dirname, "../../public"),
    plugins: [tsconfigPaths(), react(), ssr(), nodePolyfills()],
    optimizeDeps: {
      include: ['@snapshot-labs/sx'],
      esbuildOptions: {
        format: 'esm', // or 'cjs' depending on the package
      },
    },

    build: {
      emptyOutDir: true,
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
