import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.js'],
        include: ['src/**/*.test.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html']
        }
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})