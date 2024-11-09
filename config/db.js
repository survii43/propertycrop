const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Allows pooling of connections
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue size
});

// MySQL pool is automatically connected and ready to use with promises
console.log("MySQL Connected...");

module.exports = db;
