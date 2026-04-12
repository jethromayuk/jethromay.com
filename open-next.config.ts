import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache'

export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(staticAssetsIncrementalCache, {
    mode: 'long-lived',
  }),
  enableCacheInterception: true,
})
