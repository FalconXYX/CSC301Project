/**
 * Server Configuration
 * Centralized server settings
 */

module.exports = {
  // Static files path
  publicPath: "./public",

  // Environment
  environment: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Logging
  logFormat: "dev",

  // Middleware options
  middleware: {
    json: true,
    urlEncoded: { extended: false },
    cookieParser: true,
    static: true,
  },
};
