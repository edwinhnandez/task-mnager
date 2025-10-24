import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'coverage/**',
        '**/*.config.js',
        'config.js',
        'config.example.js',
        'app.js', // CDN-based Vue app - requires component testing
        'index.html',
        'style.css'
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    },
    include: ['**/*.test.js', '**/__tests__/**/*.js'],
    setupFiles: ['./test-setup.js']
  }
});

