'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_favorite_product', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      account_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'db_account',
          key: 'id'
        }
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'db_product',
          key: 'id'
        }
      },
      product_variant_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'db_product_variant',
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

  async down(queryInterface) {
    await queryInterface.dropTable('db_favorite_product');
  }
};
