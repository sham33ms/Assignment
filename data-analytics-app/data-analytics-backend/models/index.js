// models/index.js
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config.js');

// Updated Sequelize constructor for PostgreSQL
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.User = require('./user.model.js')(sequelize, Sequelize);
db.Event = require('./event.model.js')(sequelize, Sequelize);
db.Metric = require('./metric.model.js')(sequelize, Sequelize);
db.Report = require('./report.model.js')(sequelize, Sequelize);

// Setup associations (this part remains the same)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;