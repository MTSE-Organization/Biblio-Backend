'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_product', 'discount', {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      after: 'meta_data'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('db_product', 'discount', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      after: 'meta_data'
    });
  }
};
