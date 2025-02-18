import { Pool } from 'pg';
import 'dotenv/config';

// interface EnvConstants {
//     USER: string,
//     DB_URL: string,
//     DB_NAME: string,
//     PASS: string,
//     PORT: string,
// }

const {
    USER = 'nikitkhom',
    DB_URL = '::1',
    DB_NAME = 'constructor',
    PASS = '',
    PORT = '5432',
}: NodeJS.ProcessEnv = process.env;

const pool = new Pool({
    user: USER,
    host: DB_URL,
    database: DB_NAME,
    password: PASS,
    port: parseInt(PORT)
});

const query = (text: string, params?: any[]) => pool.query(text, params);

export default query;