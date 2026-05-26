const { Client } = require("pg");
const config = require("./config");

const SQL = `
DROP TABLE IF EXISTS clubhouse_users CASCADE;

DROP TABLE IF EXISTS clubhouse_messages CASCADE;

DROP TABLE IF EXISTS clubhouse_session CASCADE;
`;

async function main() {
  console.log("Wiping tables...");
  const client = new Client(config);
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Tables wiped.");
}

main();
