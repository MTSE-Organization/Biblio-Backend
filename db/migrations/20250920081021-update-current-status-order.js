'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_order', 'current_status', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_order', 'current_status', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    });
  }
};
