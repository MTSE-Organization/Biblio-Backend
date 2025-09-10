'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('db_product', 'length');
    await queryInterface.removeColumn('db_product', 'width');
    await queryInterface.removeColumn('db_product', 'height');
    await queryInterface.removeColumn('db_product', 'quantity');

    await queryInterface.addColumn('db_product', 'language', {
      type: Sequelize.STRING,
      after: 'age_rating'
    });

    await queryInterface.addColumn('db_product', 'meta_data', {
      type: Sequelize.TEXT,
      after: 'is_featured'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('db_product', 'length', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
    await queryInterface.addColumn('db_product', 'width', {
      type: Sequelize.FLOAT
    });
    await queryInterface.addColumn('db_product', 'height', {
      type: Sequelize.FLOAT
    });
    await queryInterface.addColumn('db_product', 'quantity', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.removeColumn('db_product', 'language');
    await queryInterface.removeColumn('db_product', 'metaData');
  }
};
