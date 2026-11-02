import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/web',
  use: { baseURL: 'http://localhost:5183', viewport: { width: 1440, height: 1000 } },
  webServer: {
    command: 'npm run dev -w @agri/web -- --port 5183',
    url: 'http://localhost:5183',
    reuseExistingServer: false,
    env: { VITE_DATA_SOURCE: 'mock' },
  },
});
