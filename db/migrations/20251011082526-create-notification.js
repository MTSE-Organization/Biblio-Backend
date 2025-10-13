'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('db_notification', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING
      },
      image_url: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      account_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'db_account',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.TEXT
      },
      seen: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      last_time_read: {
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
    await queryInterface.dropTable('db_notification');
  }
};
