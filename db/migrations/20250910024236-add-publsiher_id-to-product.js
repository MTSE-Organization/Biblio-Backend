'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_product', 'publisher_id', {
      type: DataTypes.BIGINT,
      after: 'category_id',
      references: {
        model: 'db_publisher',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_product', 'publisher_id');
  },
};
