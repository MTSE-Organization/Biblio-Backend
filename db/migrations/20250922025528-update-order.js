'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order', 'delivery_fee', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      after: 'address_id'
    });
    await queryInterface.addColumn('db_order', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0,
      after: 'delivery_fee'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order', 'delivery_fee');
    await queryInterface.removeColumn('db_order', 'total');
  }
};
