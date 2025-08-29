'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('db_category', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      ordering: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('db_category');
  },
};
