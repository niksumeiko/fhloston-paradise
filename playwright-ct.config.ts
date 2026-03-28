import { defineConfig, devices } from '@playwright/experimental-ct-react';
import react from '@vitejs/plugin-react';

export default defineConfig({
    testMatch: '**/*.ct.tsx',
    use: {
        // CT spins up its own server — no webServer block needed
        ctViteConfig: {
            plugins: [react()],
        },
        headless: true,
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
