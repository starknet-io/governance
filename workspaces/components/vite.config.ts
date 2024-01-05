import react from "@vitejs/plugin-react";
import type { UserConfig } from "vite";
// import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import {fileURLToPath, URL} from "url";

export default {
  resolve: {
    alias: {
      "#src": fileURLToPath(new URL("./src", import.meta.url)),
    }
  },
  // publicDir: path.resolve(__dirname, "../../public"),
  plugins: [react()],
} as UserConfig;
