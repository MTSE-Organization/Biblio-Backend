'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_order', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      account_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'db_account',
          key: 'id'
        }
      },
      current_status: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      payment_method: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.TEXT
      },
      address_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'db_address',
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
    await queryInterface.dropTable('db_order');
  }
};
