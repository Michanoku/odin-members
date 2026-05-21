const pool = require("../db/pool");
const request = require("supertest");
const app = require("../app");

// Wipe DB before each test to make sure everything is as expected
beforeEach(async () => {
  await pool.query("TRUNCATE users, messages, session RESTART IDENTITY CASCADE");
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
