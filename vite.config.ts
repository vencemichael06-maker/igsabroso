// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

const pagesRecovery = process.env.CF_PAGES === "1";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    prerender: pagesRecovery ? { enabled: true, crawlLinks: false, failOnError: true } : undefined,
    pages: pagesRecovery ? ["/", "/projects", "/details", "/consultation"].map((path) => ({ path })) : undefined,
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // The TanStack Start Vite build uses this entry.
    server: { entry: "server" },
  },
  vite: {
    preview: pagesRecovery ? { host: "127.0.0.1" } : undefined,
    plugins: pagesRecovery ? [] : [netlify()],
    define: { "import.meta.env.VITE_PAGES_RECOVERY": JSON.stringify(pagesRecovery) },
  },
});
