import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    projects: [
      {
        // Unit + component tests: live next to the code, never touch a database
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        // Integration tests: Payload Local API against TEST_DATABASE_URL
        extends: true,
        test: {
          name: 'int',
          environment: 'node',
          setupFiles: ['./tests/helpers/testEnv.ts'],
          include: ['tests/int/**/*.int.spec.ts'],
          fileParallelism: false,
          hookTimeout: 60_000,
        },
      },
    ],
  },
})
