'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('db_product_image', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ordering: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      product_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'db_product',
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

  async down(queryInterface) {
    await queryInterface.dropTable('db_product_image');
  },
};
