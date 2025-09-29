'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_product', 'total_reviews', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: 'total_views'
    });
    await queryInterface.addColumn('db_product', 'average_review', {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
      after: 'total_reviews'
    });
    await queryInterface.addColumn('db_product', 'total_sold', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: 'average_review'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_product', 'total_reviews');
    await queryInterface.removeColumn('db_product', 'average_review');
    await queryInterface.removeColumn('db_product', 'total_sold');
  }
};
