import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig, defineConfig } from "vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  resolve: {
    alias: {
      stream: "stream-browserify",
    },
  },
  publicDir: path.resolve(__dirname, "../../public"),
  plugins: [tsconfigPaths(), react(), ssr()],
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
        }),
      ],
    },
  },
  ssr: {
    noExternal: ["@chakra-ui/*", "react-icons"],
  },
}) as UserConfig;
