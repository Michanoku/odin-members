const dbMap = {
  development: `${process.env.DB_NAME}_dev`,
  test: `${process.env.DB_NAME}_test`,
  production: "messages_t1eu",
};

const dbName = dbMap[process.env.NODE_ENV] || dbMap.development;

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: dbName,
  password: process.env.DB_PASSWORD,
  port: 5432,
};
