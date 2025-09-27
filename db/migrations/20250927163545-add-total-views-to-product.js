'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_product', 'total_views', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'publisher_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_product', 'total_views');
  }
};
