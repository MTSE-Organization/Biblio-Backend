'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order_item', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      after: 'quantity'
    });

    await queryInterface.addColumn('db_order_item', 'discount', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'price'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order_item', 'price');
    await queryInterface.removeColumn('db_order_item', 'discount');
  }
};
