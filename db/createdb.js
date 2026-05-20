require("dotenv").config();
const { Client } = require("pg");

const SQL = `
TODO
`;

async function main() {
  console.log("Creating tables...");
  const client = new Client({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Tables created.");
}

main();
