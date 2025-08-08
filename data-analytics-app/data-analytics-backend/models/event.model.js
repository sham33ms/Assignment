module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("events", {
    type: {
      type: Sequelize.STRING,
      allowNull: false // Must receive a 'type'
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false // Must receive a 'category'
    },
    details: {
      type: Sequelize.JSON // Can be null
    }
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false // An event MUST belong to a user
      }
    });
  };

  return Event;
};