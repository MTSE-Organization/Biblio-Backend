'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_review', 'product_variant_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'db_product_variant',
        key: 'id'
      },
      after: 'product_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_review', 'product_variant_id');
  }
};
