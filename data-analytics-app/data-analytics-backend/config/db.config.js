// config/db.config.js
module.exports = {
  HOST: "localhost",
  USER: "postgres",       // Your PostgreSQL username
  PASSWORD: "1234",         // Your PostgreSQL password
  DB: "db2",              // Your PostgreSQL database name
  dialect: "postgres",
  pool: {                 // Optional: connection pool configuration
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};