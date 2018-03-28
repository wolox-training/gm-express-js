'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM,
      values: ['regular', 'admin'],
      defaultValue: 'regular',
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('users', 'role')
      .then(() => queryInterface.sequelize.query('DROP TYPE "enum_users_role";'));
  }
};
