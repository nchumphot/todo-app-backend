import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const client = new Client({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.MYUSER,
  password: process.env.PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});
