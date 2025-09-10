'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_contributor', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      avatar_path: {
        type: DataTypes.STRING,
      },
      kind: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.INTEGER,
      },
      date_of_birth: {
        type: DataTypes.DATE,
      },
      country: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('db_contributor');
  },
};
