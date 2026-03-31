import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
    allowCypressEnv: false,

    e2e: {
        setupNodeEvents(on, config) {
            codeCoverageTask(on, config);
            // include any other plugin code...

            // It's IMPORTANT to return the config object
            // with any changed environment variables
            return config;
        },
        baseUrl: 'http://localhost:5173',
    },

    component: {
        devServer: {
            framework: 'react',
            bundler: 'webpack',
        },
    },
});
