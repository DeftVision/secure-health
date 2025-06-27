require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL, // optional for hosted DBs
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: './migrations',
    },
  },
};
