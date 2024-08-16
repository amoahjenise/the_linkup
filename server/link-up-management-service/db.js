require("dotenv").config({ path: "./server/link-up-management-service/.env" });
const { Pool } = require("pg");

// console.log("Loading .env from", require("path").resolve(".env"));

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_DBPORT,
  database: process.env.POSTGRES_DB,
});

module.exports = {
  pool: pool,
};
