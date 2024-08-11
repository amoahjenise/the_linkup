require("dotenv").config();
const Pool = require("pg").Pool;

console.log("DB User:", process.env.POSTGRES_USER); // For debugging
console.log("DB Host:", process.env.POSTGRES_HOST); // For debugging

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
