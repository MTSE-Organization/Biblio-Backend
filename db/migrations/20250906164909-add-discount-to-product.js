'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_product', 'discount', {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      after: 'quantity',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_product', 'discount');
  },
};
