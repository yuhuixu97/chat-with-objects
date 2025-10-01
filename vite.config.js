import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // 关键：告诉 Vite 所有资源用相对路径加载
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 允许局域网访问
    port: 5173,
    allowedHosts: [
      "mazda-antibody-claims-revelation.trycloudflare.com", // 这里写 cloudflare 给的域名
    ],
  },
});
