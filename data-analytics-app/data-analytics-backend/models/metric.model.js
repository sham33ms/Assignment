// models/metric.model.js
module.exports = (sequelize, Sequelize) => {
  const Metric = sequelize.define("metrics", {
    name: {
      type: Sequelize.STRING, // e.g., 'API Latency', 'CPU Usage'
      allowNull: false
    },
    value: {
      type: Sequelize.FLOAT,
      allowNull: false
    }
  });

  Metric.associate = (models) => {
    Metric.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Metric;
};