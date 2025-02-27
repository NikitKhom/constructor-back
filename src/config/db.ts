import { Pool } from "pg";

const {
  USER = "nikitkhom",
  DB_URL = "::1",
  DB_NAME = "constructor",
  PASS = "",
  PORT = "5432",
}: NodeJS.ProcessEnv = process.env;

const pool = new Pool({
  user: USER,
  host: DB_URL,
  database: DB_NAME,
  password: PASS,
  port: parseInt(PORT)
});

const checkDBConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("DB connected");
    client.release();
  } catch (error) {
    console.error("DB is not connected");
    process.exit(1);
  }
};


export { pool, checkDBConnection };