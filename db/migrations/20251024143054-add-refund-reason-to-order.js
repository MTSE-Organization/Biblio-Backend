'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order', 'refund_reason', {
      type: Sequelize.TEXT,
      after: 'total'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order', 'refund_reason');
  }
};
