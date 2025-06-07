import type { Config } from "@react-router/dev/config";
import { loadEnv } from "vite";

// Load environment variables based on the current mode
const mode = process.env.NODE_ENV || "development";
const env = loadEnv(mode, process.cwd(), "");

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false,
  // Use BASE_URL from .env file or default to root (/)
  basename: env.BASE_URL || "/",
  future: {
    // Enable v7 APIs for Router Data
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true,
  },
} satisfies Config;
