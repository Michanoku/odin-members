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
    "TRUNCATE clubhouse_users, clubhouse_messages, clubhouse_session RESTART IDENTITY CASCADE",
  );

  // Create the user used for the test
  const agent = request.agent(app);

  const response = await agent.post("/register").send({
    firstName: "Testor",
    lastName: "Testman",
    email: "test@test.com",
    password: "supersecure123",
    confirmation: "supersecure123",
  });
});

afterAll(async () => {
  await pool.end();
});

test("anonymous user can't write messages", async () => {
  const agent = request.agent(app);

  const response = await agent.get("/new");

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/login");
});

test("guest user can write messages", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/new").send({
    title: "Testtitle",
    message: "Testmessage",
  });

  const response = await agent.get("/");

  expect(response.text).toContain("Anonymous");
  expect(response.text).toContain("Testtitle");
  expect(response.text).toContain("Testmessage");
  expect(response.text).not.toContain("Delete");
});

test("guest user can read messages but not names", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/");

  expect(response.text).toContain("Anonymous");
  expect(response.text).toContain("Testtitle");
  expect(response.text).toContain("Testmessage");
});

test("guest user can't see delete button", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/");

  expect(response.text).not.toContain("Delete");
});

test("guest user can't delete messages", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const { rows } = await pool.query("SELECT message_id FROM clubhouse_messages");

  const response = await agent.post("/delete").send({
    messageId: rows[0],
  });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/join");
});

test("member user can read names and times", async () => {
  await pool.query("UPDATE clubhouse_users SET member = true");

  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/");

  // Normalizing because of HTML formatting not reflecting visual sentence
  const normalizedText = response.text.replace(/\s+/g, " ");
  expect(normalizedText).toContain("Testor Testman wrote");
});

test("member user can't see delete button", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/");

  expect(response.text).not.toContain("Delete");
});

test("member user can't delete messages", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const { rows } = await pool.query("SELECT message_id FROM clubhouse_messages");

  const response = await agent.post("/delete").send({
    messageId: rows[0].message_id,
  });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/join");
});

test("admin user can see delete button", async () => {
  await pool.query("UPDATE clubhouse_users SET admin = true");

  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.get("/");
  expect(response.text).toContain("Delete");
});

test("admin user can delete messages", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const { rows } = await pool.query("SELECT message_id FROM clubhouse_messages");

  const response = await agent.post("/delete").send({
    messageId: rows[0].message_id,
  });

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("message is deleted", async () => {
  const agent = request.agent(app);

  const response = await agent.get("/");

  expect(response.text).not.toContain("Anonymous");
  expect(response.text).not.toContain("Testtitle");
  expect(response.text).not.toContain("Testmessage");
});
