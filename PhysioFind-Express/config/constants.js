/**
 * Application Constants
 * Global constants and configuration values
 */

module.exports = {
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

  // TODO: Add more constants as needed
};
