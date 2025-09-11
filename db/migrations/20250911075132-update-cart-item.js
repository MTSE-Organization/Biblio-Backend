'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_cart_item', 'product_id');

    await queryInterface.addColumn('db_cart_item', 'product_variant_id', {
      type: Sequelize.BIGINT,
      after: 'cart_id',
      references: {
        model: 'db_product_variant',
        key: 'id'
      },
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_cart_item', 'product_variant_id');

    await queryInterface.addColumn('db_cart_item', 'product_id', {
      type: Sequelize.BIGINT,
      after: 'cart_id',
      references: {
        model: 'db_product',
        key: 'id'
      },
      allowNull: false
    });
  }
};
