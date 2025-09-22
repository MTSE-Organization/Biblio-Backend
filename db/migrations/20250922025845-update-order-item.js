'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order_item', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      after: 'discount'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order_item', 'total');
  }
};
