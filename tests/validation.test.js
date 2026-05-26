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

  // Create the user used for the test
  const agent = request.agent(app);

  const response = await agent.post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "testor@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });
});

afterAll(async () => {
  await pool.end();
});

// Registration validation
test("registration requires first name", async () => {
  const response = await request(app).post("/register").send({
    firstName: "",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  expect(response.text).toContain("First name is required.");
});

test("registration requires last name", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  expect(response.text).toContain("Last name is required.");
});

test("registration requires email", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  expect(response.text).toContain("Email is required.");
});

test("registration requires valid email", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "notanemail",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  expect(response.text).toContain("Email must be a valid email address.");
});

test("registration requires password", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "",
    confirmation: "supersecure123",
  });

  expect(response.text).toContain("Password is required.");
});

test("registration rejects short passwords", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "short",
    confirmation: "short",
  });

  expect(response.text).toContain(
    "Password must be between 12 and 72 characters.",
  );
});

test("registration rejects passwords longer than 72 characters", async () => {
  const longPassword = "a".repeat(73);

  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: longPassword,
    confirmation: longPassword,
  });

  expect(response.text).toContain(
    "Password must be between 12 and 72 characters.",
  );
});

test("registration requires confirmation", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "",
  });

  expect(response.text).toContain("Confirmation is required.");
});

test("registration requires matching confirmation", async () => {
  const response = await request(app).post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "differentpassword",
  });

  expect(response.text).toContain("Confirmation does not match password.");
});

test("whitespace-only first name is rejected", async () => {
  const response = await request(app).post("/register").send({
    firstName: "     ",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });

  expect(response.text).toContain("First name is required.");
});

// Login validation
test("login requires email", async () => {
  const response = await request(app).post("/login").send({
    email: "",
    password: "supersecure123",
  });

  expect(response.text).toContain("Email is required.");
});

test("login requires password", async () => {
  const response = await request(app).post("/login").send({
    email: "test@test.com",
    password: "",
  });

  expect(response.text).toContain("Password is required.");
});

test("whitespace-only login fields are rejected", async () => {
  const response = await request(app).post("/login").send({
    email: "     ",
    password: "     ",
  });

  expect(response.text).toContain("Email is required.");
  expect(response.text).toContain("Password is required.");
});

// Message validation
test("message requires a title", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/new").send({
    title: "",
    message: "Hello world",
  });

  expect(response.text).toContain("Title is required.");
});

test("whitespace-only title is rejected", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/new").send({
    title: "     ",
    message: "Hello world",
  });

  expect(response.text).toContain("Title is required.");
});

test("message title cannot exceed 255 characters", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const longTitle = "a".repeat(256);

  const response = await agent.post("/new").send({
    title: longTitle,
    message: "Hello world",
  });

  expect(response.text).toContain(
    "Title must not be longer than 255 characters.",
  );
});

test("message requires content", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/new").send({
    title: "Hello",
    message: "",
  });

  expect(response.text).toContain("Message is required.");
});

test("whitespace-only message is rejected", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/new").send({
    title: "Hello",
    message: "     ",
  });

  expect(response.text).toContain("Message is required.");
});

// Secret password validation
test("secret password is required", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/join").send({
    password: "",
  });

  expect(response.text).toContain("Password is required.");
});

test("invalid secret password is rejected", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "testor@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/join").send({
    password: "wrongpassword",
  });

  expect(response.text).toContain("Invalid secret password.");
});

