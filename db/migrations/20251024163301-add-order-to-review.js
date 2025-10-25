'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_review', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'db_order',
        key: 'id'
      },
      after: 'id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_review', 'id');
  }
};
