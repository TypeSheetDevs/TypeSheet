/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '^.+\\.svg$': 'jest-transformer-svg',
        '^@assets/(.*)': '<rootDir>/src/assets/$1',
        '^@components/(.*)': '<rootDir>/src/components/$1',
        '^@context/(.*)': '<rootDir>/src/context/$1',
        '^@data/(.*)': '<rootDir>/src/data/$1',
        '^@hooks/(.*)': '<rootDir>/src/hooks/$1',
        '^@layouts/(.*)': '<rootDir>/src/layouts/$1',
        '^@utils/(.*)': '<rootDir>/src/utils/$1',
        '^@services/(.*)': '<rootDir>/src/services/$1',
    },
    modulePathIgnorePatterns: ['<rootDir>/src/tests/'],
    transform: {
        '^.+.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.web.json' }],
    },
};
