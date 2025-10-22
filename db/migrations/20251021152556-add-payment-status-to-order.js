'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order', 'payment_status', {
      type: Sequelize.INTEGER,
      after: 'payment_method'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order', 'payment_status');
  }
};
