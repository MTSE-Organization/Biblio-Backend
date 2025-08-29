'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('db_group_permission', {
      group_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'db_group',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'db_permission',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('db_group_permission');
  },
};
