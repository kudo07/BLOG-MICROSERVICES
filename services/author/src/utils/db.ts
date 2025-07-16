import { neon } from '@neondatabase/serverless';
import { config } from '@dotenvx/dotenvx';
config();
export const sql = neon(process.env.DB_URL as string);
