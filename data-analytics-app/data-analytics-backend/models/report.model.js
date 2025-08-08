// models/report.model.js
module.exports = (sequelize, Sequelize) => {
  const Report = sequelize.define("reports", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    filters: {
      type: Sequelize.JSON, // Store applied filters
      allowNull: false
    },
    filePath: {
      type: Sequelize.STRING // Path to the generated report file
    }
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Report;
};