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
  await pool.query(
    "TRUNCATE users, messages, session RESTART IDENTITY CASCADE",
  );
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

test("user is a guest at first", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const index = await agent.get("/");

  expect(index.text).toContain("Guest");
});

test("user can navigate to join page", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const join = await agent.get("/join");
  expect(join.status).toBe(200);
});

test("user receives error when submitting wrong password", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/join").send({
    password: "wrongpassword",
  });
  expect(response.text).toContain("Invalid secret password.");
});

test("user can enter the correct password and become a member", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/join").send({
    password: process.env.MEMBER_PASSWORD,
  });

  const response = await agent.get("/");
  expect(response.text).toContain("Member");
});

test("user can enter the correct password and become an admin", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/join").send({
    password: process.env.ADMIN_PASSWORD,
  });
  const response = await agent.get("/");
  expect(response.text).toContain("Admin");
});

test("user can enter the correct password and become a guest again", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/join").send({
    password: process.env.RESET_PASSWORD,
  });
  const response = await agent.get("/");
  expect(response.text).toContain("Guest");
});

test("user is logged out successfully", async () => {
  const agent = request.agent(app);

  const logoutResponse = await agent.get("/logout");

  expect(logoutResponse.status).toBe(302);
  expect(logoutResponse.headers.location).toBe("/");

  const afterLogout = await agent.get("/");

  expect(afterLogout.text).not.toContain("test@test.com");
});
