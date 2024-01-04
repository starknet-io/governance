import react from "@vitejs/plugin-react";
import ssr from "vike/plugin";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  publicDir: path.resolve(__dirname, "../../public"),
  plugins: [react(), ssr()],
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
    ],
  },
  resolve: {
    alias: {
      'src/': path.resolve(__dirname, './src/'),
      // ... other aliases
    },
  },
  // resolve.alias is omitted as it's not needed
});
