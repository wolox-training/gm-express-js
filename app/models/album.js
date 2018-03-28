'use strict';

module.exports = (sequelize, DataTypes) => {
  const album = sequelize.define('album', {
    externalId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false }
  });

  const User = sequelize.define('users');

  album.belongsTo(User);
  return album;
};
