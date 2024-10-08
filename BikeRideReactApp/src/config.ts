// src/config.ts

const ENV = {
  dev: {
    apiUrl: 'http://3.104.121.149:8081',
  },
  staging: {
    apiUrl: 'https://staging.yourapi.com',
  },
  prod: {
    apiUrl: 'https://yourapi.com',
  },
};

const getEnvVars = (env = 'dev') => {
  // Add logic here to handle different environments
  // This can be extended to read from a .env file or other sources
  if (env === 'prod') {
    return ENV.prod;
  } else if (env === 'staging') {
    return ENV.staging;
  } else {
    return ENV.dev;
  }
};

export default getEnvVars;
