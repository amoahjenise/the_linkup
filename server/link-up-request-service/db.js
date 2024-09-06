require("dotenv").config({ path: "./server/link-up-request-service/.env" });

const Pool = require("pg").Pool;
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: isProduction
    ? { rejectUnauthorized: false } // SSL enabled for production
    : false, // SSL disabled for development
});

module.exports = {
  pool: pool,
};
