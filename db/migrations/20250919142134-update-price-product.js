'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_product', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_product', 'price', {
      type: Sequelize.FLOAT,
      allowNull: false
    });
  }
};
