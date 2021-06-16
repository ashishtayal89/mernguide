// Get the environment name for NODE_ENV command line argument.
const env = process.env.NODE_ENV;

// All the environments
const environments = {
  staging: {
    httpPort: 3000,
    httpsPort: 3001,
    envName: "staging",
    hashingSecret: "stagingHashSecret",
    maxChecks: 5,
    twilio: {
      accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
      authToken: "9455e3eb3109edc12e3d8c92768f7a67",
      fromPhone: "+15005550006",
    },
    stripeSecret: "sk_test_PGqotvlolbS4OvAhTsZWJAS300ee2jy9sU"
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: "productionHashSecret",
    maxChecks: 10,
  },
};

// Check if env exists then convert it to lower case else assign empty string
const envName = env ? env.toLowerCase() : "";

// Get the environment specific config if available else staging
const config = environments[envName] || environments.staging;

// Add dev mode identifier in config
config.isDevMode = envName === "staging";

// Export the environment configuration
module.exports = config;
