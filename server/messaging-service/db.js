require("dotenv").config();
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: "db", // Connect to the PostgreSQL container within the same Docker network
  port: 5432,
  database: process.env.POSTGRES_DB,
});

module.exports = {
  pool: pool,
};
