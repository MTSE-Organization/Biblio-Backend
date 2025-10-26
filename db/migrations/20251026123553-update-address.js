'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_address', 'receiver_name', {
      type: Sequelize.TEXT,
      after: 'account_id'
    });
    await queryInterface.addColumn('db_address', 'phone_number', {
      type: Sequelize.TEXT,
      after: 'receiver_name'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_address', 'receiver_name');
    await queryInterface.removeColumn('db_address', 'phone_number');
  }
};
