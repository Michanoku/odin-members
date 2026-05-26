const { Client } = require("pg");
const config = require("./config");

const SQL = `
CREATE TABLE IF NOT EXISTS clubhouse_users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  hash TEXT NOT NULL,
  member BOOLEAN NOT NULL DEFAULT FALSE,
  admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS clubhouse_messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INTEGER references users(user_id)
);

CREATE TABLE IF NOT EXISTS clubhouse_session (
  sid varchar NOT NULL PRIMARY KEY,
  sess json NOT NULL,
  expire timestamp(6) NOT NULL
);
`;

async function main() {
  console.log("Creating tables...");
  const client = new Client(config);
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Tables created.");
}

main();
