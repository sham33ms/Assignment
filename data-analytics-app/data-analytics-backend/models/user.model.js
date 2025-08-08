// models/user.model.js
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Event, { onDelete: 'CASCADE' });
    User.hasMany(models.Metric, { onDelete: 'CASCADE' });
    User.hasMany(models.Report, { onDelete: 'CASCADE' });
  };

  return User;
};