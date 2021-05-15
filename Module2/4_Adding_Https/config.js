// Get the environment name for NODE_ENV command line argument.
const env = process.env.NODE_ENV;
console.log(env);

// All the environments
const environments = {
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging"
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production"
  }
};

// Check if env exists then convert it to lower case else assign empty string
const envName = env ? env.toLowerCase() : "";

// Get the environment specific config if available else staging
const config = environments[envName] || environments.staging;

// Export the environment configuration
module.exports = config;
