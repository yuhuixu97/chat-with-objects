import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // 关键：告诉 Vite 所有资源用相对路径加载
  plugins: [react()],
});
