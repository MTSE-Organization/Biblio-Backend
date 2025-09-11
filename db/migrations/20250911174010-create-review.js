'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_review', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      product_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'db_product',
          key: 'id'
        }
      },
      account_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'db_account',
          key: 'id'
        }
      },
      rate: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('db_review');
  }
};
