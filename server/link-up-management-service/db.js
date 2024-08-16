require("dotenv").config({ path: "./server/link-up-management-service/.env" });
const { Pool } = require("pg");

// console.log("Loading .env from", require("path").resolve(".env"));

const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "Bl_ablabla))1",
  host: process.env.POSTGRES_HOST || "localhost",
  port: process.env.POSTGRES_DBPORT || 5432,
  database: process.env.POSTGRES_DB || "luul",
});

module.exports = {
  pool: pool,
};
