/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'db_group',
      [
        {
          id: 1,
          name: 'Role Super Admin',
          description: 'Role Super Admin',
          kind: 1,
          is_system_role: 1,
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1,
        },
        {
          id: 2,
          name: 'Role Admin',
          description: 'Role Admin',
          kind: 1,
          is_system_role: 1,
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1,
        },
        {
          id: 3,
          name: 'Role User',
          description: 'Role User',
          kind: 2,
          is_system_role: 1,
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('db_group', null, {});
  },
};
