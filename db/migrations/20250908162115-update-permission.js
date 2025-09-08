'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_permission', 'name_group');

    await queryInterface.addColumn('db_permission', 'permission_group_id', {
      type: DataTypes.BIGINT,
      after: 'p_code',
      references: {
        model: 'db_permission_group',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_permission', 'permission_group_id');
    await queryInterface.addColumn('db_permission', 'name_group', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
