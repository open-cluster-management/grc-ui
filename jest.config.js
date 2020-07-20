/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
const tapReporter = [
  'jest-tap-reporter',
  {
    logLevel: 'ERROR',
    showInternalStackTraces: true,
    filePath: 'test-output/unit/jestTestLogs.tap'
  }
]

const jestConfig = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src-web/**/*.{js,jsx}'
  ],
  coverageDirectory: './test-output/unit/coverage',
  coverageReporters: [
    'json-summary',
    'json',
    'html',
    'lcov',
    'text',
    'text-summary'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  testURL: 'http://localhost/',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testMatch: [
    '<rootDir>/tests/jest/*/*.test.js?(x)',
    '<rootDir>/tests/jest/*/*/*.test.js?(x)',
    '<rootDir>/tests/jest/*/*/*/*.test.js?(x)',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.+\\.(hbs)$': 'jest-handlebars',
    '.+\\.(handlebars)$': 'jest-handlebars',
    '.+\\.(yaml)$': 'jest-yaml-transform'
  },
  globalSetup: '<rootDir>/tests/jest/config/properties-to-json.js',
  setupFiles: [
    '<rootDir>/tests/jest/config/setup.js'
  ],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': '<rootDir>/tests/jest/config/styleMock.js',
    'monaco-editor': '<rootDir>/node_modules/react-monaco-editor'
  }
}

jestConfig.reporters = process.env.TRAVIS ? [ 'default', tapReporter ] : [ 'default']

module.exports = jestConfig
