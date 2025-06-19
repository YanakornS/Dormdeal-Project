import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "light", // ธีมเริ่มต้น
      "dark", // ธีมที่ใช้เมื่อ dark mode เปิดใช้งาน
      "cupcake", // ธีม cupcake
    ],
  },
});
