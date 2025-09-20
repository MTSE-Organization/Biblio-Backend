'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_product_variant', 'modified_price', {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_product_variant', 'modified_price', {
      type: Sequelize.FLOAT,
      defaultValue: 0
    });
  }
};
