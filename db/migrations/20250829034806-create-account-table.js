'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('db_account', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      avatar_path: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
      },
      kind: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_super_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      group_id: {
        type: DataTypes.BIGINT,
        references: {
          model: 'db_group',
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
    await queryInterface.dropTable('db_account');
  },
};
