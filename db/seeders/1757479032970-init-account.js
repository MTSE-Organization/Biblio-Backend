/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'db_account',
      [
        {
          id: 1,
          email: 'admin@example.com',
          password:
            '$2a$10$1TbkCzw6moZUyvXHFUpabudJi4Go/Pbf08ahc3ch0V/ZnhNz3bw.2',
          full_name: 'Super Admin',
          avatar_path: null,
          phone: null,
          kind: 1,
          is_super_admin: 1,
          group_id: 1,
          created_date: '2025-09-10 04:32:40',
          modified_date: '2025-09-10 04:32:40',
          status: 1,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('db_account', null, {});
  },
};
