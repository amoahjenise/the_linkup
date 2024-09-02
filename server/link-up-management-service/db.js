require("dotenv").config({ path: "./server/link-up-management-service/.env" });
const { Pool } = require("pg");

// console.log("Loading .env from", require("path").resolve(".env"));

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  ssl: {
    rejectUnauthorized: false, // Add this line if the certificate is self-signed or not verifiable
  },
});

module.exports = {
  pool: pool,
};
