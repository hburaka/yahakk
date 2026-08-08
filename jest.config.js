module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@drizzle/(.*)$': '<rootDir>/drizzle/$1',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};
