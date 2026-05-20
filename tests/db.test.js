const pool = require("../db/pool");
const request = require("supertest");
const app = require("../app");

const createTables = async () => {
  pool.query(`
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  hash TEXT NOT NULL,
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
  `);
};

beforeAll(async () => {
  await createTables();
})

// Wipe DB before each test to make sure everything is as expected
beforeEach(async () => {
  await pool.query("TRUNCATE users, messages RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});

test("User is saved to DB correctly.", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    "test@test.com",
  ]);

  expect(result.rows.length).toBe(1);
  expect(result.rows[0].password).not.toBe("supersecure123");
});
