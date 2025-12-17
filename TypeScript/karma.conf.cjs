/* eslint-disable no-undef */
module.exports = function (config) {
  config.set({
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-esbuild'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage')
    ],
    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/tests/**/*.spec.ts', included: true },
      { pattern: 'src/tests/**/*.spec.tsx', included: true },
      { pattern: 'src/data/**/*.ts', included: false }
    ],

    preprocessors: {
      'src/data/**/*.ts': ['esbuild'],
      'src/tests/**/*.spec.ts': ['esbuild'],
      'src/tests/**/*.spec.tsx': ['esbuild']
    },

    exclude: [
      'src/**/*.d.ts',
      'src/types/**',
      'src/components/**',
      'src/pages/**',
      'src/main.*'
    ],

    reporters: ['progress', 'kjhtml'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    browsers: ['ChromeHeadless'],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    browserNoActivityTimeout: 60000,

    esbuild: {
      target: 'es2020',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx'
      },
      sourcemap: 'inline'
    },

    // coverageReporter is handled by karma-typescript via karmaTypescriptConfig.reports
  });
};
