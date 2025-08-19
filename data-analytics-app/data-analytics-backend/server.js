// server.js
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database sync
const db = require("./models");

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synced successfully with PostgreSQL.");
});

// Simple root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Data Analytics Backend API." });
});

// API routes
require('./routes/auth.routes')(app);
require('./routes/data.routes')(app);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});