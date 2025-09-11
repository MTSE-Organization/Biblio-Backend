'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_product_variant', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      condition: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      format: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      modified_price: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      image_url: {
        type: Sequelize.STRING
      },
      product_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'db_product',
          key: 'id'
        }
      },
      created_date: {
        type: Sequelize.DATE
      },
      modified_date: {
        type: Sequelize.DATE
      },
      status: {
        defaultValue: 1,
        type: Sequelize.INTEGER
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('db_product_variant');
  }
};
