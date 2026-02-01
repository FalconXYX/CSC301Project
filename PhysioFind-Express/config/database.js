/**
 * Database Configuration
 * Database connection settings
 */

module.exports = {
  type: process.env.DB_TYPE || "postgresql",

  // Database connection settings
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "physiofind",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
  },

  // Connection pool settings
  pool: {
    min: 2,
    max: 10,
  },

  // TODO: Add database-specific options (SSL, authentication, etc.)
};
