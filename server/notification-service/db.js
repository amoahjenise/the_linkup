require("dotenv").config({ path: "./server/notification-service/.env" });
const Pool = require("pg").Pool;

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
