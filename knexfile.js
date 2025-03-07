module.exports = {
    test: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5433,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "testdb",
      },
      migrations: {
        directory: "./migrations",
        tableName: "knex_migrations",
      },
      seeds: {
        directory: "./seeds",
      },
    },
    development: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_NAME || "eldoradodb",
      },
      migrations: {
        directory: "./migrations",
        tableName: "knex_migrations",
      },
    },
    production: {
      client: "pg",
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: false,
      },
      migrations: {
        directory: "./migrations",
        tableName: "knex_migrations",
      },
    },
  };
  