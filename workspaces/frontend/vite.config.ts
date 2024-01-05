import react from "@vitejs/plugin-react";
import ssr from "vike/plugin";
import { UserConfig, defineConfig } from "vite";
import path from "path";
import nodePolyfills from "vite-plugin-node-stdlib-browser";
import {fileURLToPath, URL} from "url";

console.log(fileURLToPath(new URL("./src", import.meta.url)));


export default defineConfig((env) => {
  return {
    publicDir: path.resolve(__dirname, "../../public"),
    plugins: [react(), ssr(), nodePolyfills()],
    build: {
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "#src": fileURLToPath(new URL("./src", import.meta.url)),
      }
    },
    ssr: {
      target: "node",
      noExternal: [
        "@apollo/client",
        "color-hash",
        "react-use",
        "react-syntax-highlighter",
      ],
    },
  } as UserConfig;
});
