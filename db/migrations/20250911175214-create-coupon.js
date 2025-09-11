'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_coupon', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
      },
      kind: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      value: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      min_order_amount: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      valid_from: {
        type: Sequelize.DATE
      },
      valid_to: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('db_coupon');
  }
};
