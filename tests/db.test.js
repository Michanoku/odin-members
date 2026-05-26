const request = require("supertest");
const app = require("../app");
const pool = require("../db/pool");

beforeAll(async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Not in test ENV. Aborting.");
  }

  if (!pool.options.database.endsWith("_test")) {
    throw new Error("Not in test DB. Aborting.");
  }

  // Wipe DB before test
  await pool.query(
    "TRUNCATE users, messages, session RESTART IDENTITY CASCADE",
  );
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

test("message is saved to database correctly", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/new").send({
    title: "Hello",
    message: "World",
  });

  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE title = $1",
    ["Hello"]
  );

  expect(rows.length).toBe(1);
  expect(rows[0].message).toBe("World");
});


test("member status is saved correctly", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/join").send({
    password: process.env.MEMBER_PASSWORD,
  });

  const { rows } = await pool.query(
    "SELECT member FROM users WHERE email = $1",
    ["test@test.com"],
  );

  expect(rows[0].member).toBe(true);
});

test("admin status is saved correctly", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  await agent.post("/join").send({
    password: process.env.ADMIN_PASSWORD,
  });

  const { rows } = await pool.query(
    "SELECT admin FROM users WHERE email = $1",
    ["test@test.com"],
  );

  expect(rows[0].admin).toBe(true);
});

test("status is reset correctly", async () => {
  const agent = request.agent(app);

  await agent.post("/login").send({
    email: "test@test.com",
    password: "supersecure123",
  });

  const response = await agent.post("/join").send({
    password: process.env.RESET_PASSWORD,
  });

  const { rows } = await pool.query(
    "SELECT member, admin FROM users WHERE email = $1",
    ["test@test.com"],
  );

  expect(rows[0].member).toBe(false);
  expect(rows[0].admin).toBe(false);
});