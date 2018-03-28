'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['regular', 'admin'],
      defaultValue: 'regular'
    }
  });

  const Album = sequelize.define('albums');

  user.hasMany(Album);
  return user;
};
