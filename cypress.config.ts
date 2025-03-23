import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Assuming the Vite dev server runs on this port
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  // Configure viewports for testing
  viewportWidth: 1280,
  viewportHeight: 800,
  // Configure screenshot and video options
  screenshotOnRunFailure: true,
  video: false,
  // Add timeouts
  defaultCommandTimeout: 5000,
  
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
}); 