import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    // Stop on first failure — keeps feedback fast while learning
    maxFailures: 1,
    use: {
        baseURL: 'http://localhost:5173',
        // Captures a screenshot on failure automatically
        screenshot: 'only-on-failure',
        headless: false,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    webServer: [
        {
            command: 'node server.js',
            url: 'http://localhost:3001/api/health',
            reuseExistingServer: true,
        },
        {
            command: 'pnpm run dev -- --port 5173',
            url: 'http://localhost:5173',
            reuseExistingServer: true,
        },
    ],
});
