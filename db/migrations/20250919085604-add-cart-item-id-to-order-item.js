'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_order_item', 'cart_item_id', {
      type: Sequelize.BIGINT,
      after: 'quantity'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_order_item', 'cart_item_id');
  }
};
