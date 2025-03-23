import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // ToDo: Assuming the Vite dev server runs on this port - need to change to the env variable
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      console.log('Running tests against:', config.baseUrl);
      return config;
    },
  },
  
  // Configure viewports for testing
  viewportWidth: 1280,
  viewportHeight: 800,
  
  // Configure screenshot and video options
  screenshotOnRunFailure: true,
  
  // Only record videos in CI environments to save disk space locally
  video: process.env.CI ? true : false,
  
  // Add timeouts and retry options for better stability
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  retries: {
    runMode: 2,
    openMode: 0
  },
  
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
}); 