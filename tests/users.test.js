const request = require("supertest");
const app = require("../app");
const pool = require("../db/pool");

// Get a fresh database before the test
beforeAll(async () => {
  await pool.query("TRUNCATE users, messages RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});

test("register redirects after success", async () => {
  const response = await request(app)
    .post("/register")
    .send({
      firstName: "Testor",
      lastName: "Testman",
      email: "test@test.com",
      password: "supersecure123",
      confirmation: "supersecure123",
    });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});