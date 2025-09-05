'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_cart', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      account_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'db_account',
          key: 'id',
        },
      },
      created_date: {
        type: DataTypes.DATE,
      },
      modified_date: {
        type: DataTypes.DATE,
      },
      status: {
        defaultValue: 1,
        type: DataTypes.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_cart');
  },
};
