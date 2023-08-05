const crypto = require("crypto");

function generateRandomKey() {
  return crypto.randomBytes(32).toString("base64");
}

console.log(generateRandomKey());
