const dbMap = {
  development: "dev",
  test: "test",
  production: "prod",
};

const db = dbMap[process.env.NODE_ENV] || "dev";

const dbName = `${process.env.DB_NAME}_${db}`;

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: dbName,
  password: process.env.DB_PASSWORD,
  port: 5432,
};