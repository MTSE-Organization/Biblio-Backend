'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'db_permission',
      'created_at',
      'created_date',
    );
    await queryInterface.renameColumn(
      'db_permission',
      'updated_at',
      'modified_date',
    );
    await queryInterface.addColumn('db_permission', 'status', {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'db_permission',
      'created_date',
      'created_at',
    );
    await queryInterface.renameColumn(
      'db_permission',
      'modified_date',
      'updated_at',
    );
    await queryInterface.removeColumn('db_permission', 'status');
  },
};
