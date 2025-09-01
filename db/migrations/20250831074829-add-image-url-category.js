'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_category', 'image_url', {
      type: DataTypes.STRING,
      after: 'description',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_category', 'image_url');
  },
};
