'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_cart_item', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      cart_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'db_cart',
          key: 'id',
        },
      },
      product_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'db_product',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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
    await queryInterface.dropTable('db_cart_item');
  },
};
