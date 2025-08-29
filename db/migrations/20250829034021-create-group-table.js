'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('db_group', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      kind: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_system_role: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('db_group');
  },
};
