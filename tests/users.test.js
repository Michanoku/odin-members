require("dotenv").config();
const request = require("supertest");
const app = require("../app");
const pool = require("../db/pool");


beforeAll(async () => {
  // Throw error if the test is not running in the test setting
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Not in test ENV. Aborting.");
  }
  // Throw error if the test is not running in the test db
  if (!pool.options.database.endsWith("_test")) {
    throw new Error("Not in test DB. Aborting.");
  }
  // Truncate the db before first test
  await pool.query("TRUNCATE users, messages, session RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});

test("register logs in and redirects after success", async () => {
  const agent = request.agent(app);

  const response = await agent.post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");

  const loggedInResponse = await agent.get("/");

  expect(loggedInResponse.text).toContain("test@test.com");
});

test("user can log in and is redirected to home", async () => {
  const agent = request.agent(app);

  await agent.get("/logout");

  const response = await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("logged-in user is redirected away from login page", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/login");

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("logged-in user is redirected away from register page", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/register");

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("user is logged out successfully", async () => {
  const agent = request.agent(app);

  const logoutResponse = await agent.get("/logout");

  expect(logoutResponse.status).toBe(302);
  expect(logoutResponse.headers.location).toBe("/");

  const afterLogout = await agent.get("/");

  expect(afterLogout.text).not.toContain("test@test.com");
});