// Test setup file for Vitest
import { config } from '@vue/test-utils';

// Mock window.API_CONFIG for tests
global.window = global.window || {};
window.API_CONFIG = {
  BASE_URL: 'http://localhost:3000'
};

// Configure Vue Test Utils globally
config.global.mocks = {
  $API_BASE_URL: 'http://localhost:3000'
};

// Mock fetch for API calls
global.fetch = vi.fn();

// Helper function to create mock fetch responses
export const mockFetchResponse = (data, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
};

// Reset fetch mock before each test
beforeEach(() => {
  fetch.mockReset();
});

