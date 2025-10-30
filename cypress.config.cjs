const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      // Accessibility testing configuration
      axe: {
        branding: {
          brand: 'Spotify Clone Accessibility Tests',
          version: '1.0.0',
        },
        reporter: 'v2',
        reporterOptions: {
          html: true,
        },
      },
    },
    setupNodeEvents(on, config) {
      // Plugin for accessibility testing
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      return config;
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
