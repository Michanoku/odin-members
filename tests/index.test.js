const request = require("supertest");
const app = require("../app");

test("GET / should return 200", async () => {
  const res = await request(app).get("/");
  expect(res.statusCode).toBe(200);
});

test("GET /nonexistent should return 404", async () => {
  const res = await request(app).get("/does-not-exist");
  expect(res.statusCode).toBe(404);
});

test("GET /test-error should return 500", async () => {
  const res = await request(app).get("/test-error");
  expect(res.statusCode).toBe(500);
});

test("theme toggle switches theme cookie", async () => {
  const response = await request(app)
    .post("/theme/toggle")
    .set("Cookie", ["theme=light"]);

  expect(response.body.theme).toBe("dark");

  expect(response.headers["set-cookie"][0]).toContain(
    "theme=dark"
  );
});
