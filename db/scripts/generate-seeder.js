require('dotenv').config();
const fs = require('fs');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function generateSeeder(tableName, seederName) {
  const [rows] = await sequelize.query(`SELECT * FROM ${tableName}`);

  const cleanedRows = rows.map((row) => {
    for (const key in row) {
      if (row[key] instanceof Date || /^\d{4}-\d{2}-\d{2}T/.test(row[key])) {
        row[key] = formatDate(row[key]);
      }
    }
    return row;
  });

  const content = `/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('${tableName}', ${JSON.stringify(cleanedRows, null, 2)}, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('${tableName}', null, {});
  }
};
`;

  fs.writeFileSync(`db/seeders/${Date.now()}-${seederName}.js`, content);
  console.log(`Seeder generated: db/seeders/${Date.now()}-${seederName}.js`);
}

const [, , tableName, seederName] = process.argv;

if (!tableName || !seederName) {
  console.error(
    'Usage: node scripts/generate-seeder.js <tableName> <seederName>'
  );
  process.exit(1);
}

generateSeeder(tableName, seederName)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error generating seeder:', err);
    process.exit(1);
  });
