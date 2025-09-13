'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_account', 'password', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_account', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
