require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  member BOOLEAN NOT NULL DEFAULT FALSE,
  admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INTEGER references users(user_id)
);
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
