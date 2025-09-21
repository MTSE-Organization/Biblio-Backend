'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_coupon', 'value', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0
    });
    await queryInterface.changeColumn('db_coupon', 'min_order_amount', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_coupon', 'value', {
      type: Sequelize.FLOAT,
      defaultValue: 0
    });
    await queryInterface.changeColumn('db_coupon', 'min_order_amount', {
      type: Sequelize.FLOAT,
      defaultValue: 0
    });
  }
};
