'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      classMethods: {
        associate(models) {
          // associations can be defined here
        }
      }
    }
  );
  return user;
};
