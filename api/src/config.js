const database = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./development.sqlite"
    },
    useNullAsDefault: true,
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:"
    },
    useNullAsDefault: true,
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = {
  environment,
  database,
}
