import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://www.deutscheclipper.de',
  integrations: [
    icon(),
    sitemap({
      // Exclude pages that must not appear in search results
      filter: (page) =>
        !page.includes('/lp/') &&
        !page.includes('/danke') &&
        !page.includes('/impressum') &&
        !page.includes('/datenschutz'),
    }),
  ],
});
