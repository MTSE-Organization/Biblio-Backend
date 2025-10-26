'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order', 'reject_reason', {
      type: Sequelize.TEXT,
      after: 'refund_reason'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order', 'reject_reason');
  }
};
