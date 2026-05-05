import { defineConfig } from 'cypress';

export default defineConfig({
    env: {
        uncaughtCypressException: false,
        hideXhr: true,
    },
    chromeWebSecurity: false,
    retries: {
        runMode: 1,
        openMode: 0,
    },

    e2e: {
        baseUrl: 'http://localhost:5173',
        specPattern: 'src/**/__tests__/*.e2m.{js,jsx,ts,tsx}',
    },

    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
        },
        specPattern: 'src/**/*.test.tsx',
        viewportWidth: 680,
        viewportHeight: 768,
    },
});
