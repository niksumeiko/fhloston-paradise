import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        sequence: {
            shuffle: true,
            concurrent: true,
        },
        include: ['**/*.test.ts'],
        environment: 'node',
    },
});
