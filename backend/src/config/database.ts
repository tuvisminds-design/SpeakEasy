import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: process.env.DATABASE_TYPE === 'postgresql' ? 'pg' : 'sqlite3',
  connection: process.env.DATABASE_TYPE === 'postgresql' 
    ? {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        database: process.env.POSTGRES_DATABASE || 'speakeasy',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'password',
      }
    : {
        filename: process.env.SQLITE_DATABASE || ':memory:',
      },
  useNullAsDefault: true,
  migrations: {
    directory: './src/migrations',
  },
  seeds: {
    directory: './src/seeds',
  },
};

export const db = knex(config);

export default config;
