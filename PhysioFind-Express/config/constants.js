/**
 * Application Constants
 * Global constants and configuration values
 */

const constants = {
  // API settings
  api: {
    version: "v1",
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
  },

  // Authentication
  auth: {
    tokenExpiry: process.env.TOKEN_EXPIRY || "24h",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  // Error messages
  errors: {
    notFound: "Resource not found",
    unauthorized: "Unauthorized access",
    badRequest: "Invalid request",
    serverError: "Internal server error",
  },

  whitelist: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://falconxyx.github.io",
    "https://parthjain.ca",
    "https://csc-301-project.vercel.app",
  ],

  corsOptions: {
    origin: function (origin, callback) {
      if (!origin || constants.whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Invalid URL Access Attempt"));
      }
    },
  },
  // TODO: Add more constants as needed
};

module.exports = constants;
