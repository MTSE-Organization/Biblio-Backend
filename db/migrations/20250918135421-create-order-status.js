'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_order_status', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'db_order',
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
    await queryInterface.dropTable('db_order_status');
  }
};
