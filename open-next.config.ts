// OpenNext adapter config for Cloudflare Workers.
// See https://opennext.js.org/cloudflare/caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Pages are fully static (no ISR/revalidation), so prerendered output is
  // served straight from Workers static assets; no R2/KV bucket needed.
  incrementalCache: staticAssetsIncrementalCache,
});
