module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' if you are testing browser code
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // Adjust this based on your path aliases
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};