/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'db_permission_group',
      [
        {
          id: '2782475784671989760',
          name: 'Group',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782475927232188416',
          name: 'Permission',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782475962514673664',
          name: 'Permission Group',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476019670454272',
          name: 'Account',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476058631344128',
          name: 'File',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476110749765632',
          name: 'Category',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476142307708928',
          name: 'Product',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476160523571200',
          name: 'Product Image',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476183424471040',
          name: 'Cart',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        },
        {
          id: '2782476206354731008',
          name: 'Cart Item',
          created_date: '2025-09-10 04:30:59',
          modified_date: '2025-09-10 04:30:59',
          status: 1
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('db_permission_group', null, {});
  }
};
