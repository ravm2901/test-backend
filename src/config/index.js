import Dotenv from 'dotenv';
import path from 'path';

Dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

const isProd = NODE_ENV === 'production';
const isDev = NODE_ENV === 'development';

const config = {
  NODE_ENV,
  ROOT_PATH: path.resolve(process.env.ROOT_PATH),
  env: {
    isProd,
    isDev
  },
  db: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    alias: process.env.DB_ALIAS,
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
};

export default config;
