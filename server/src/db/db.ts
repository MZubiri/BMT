import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const connectionUri = process.env.DATABASE_URL;
    
    if (connectionUri) {
      console.log('Connecting to MySQL using DATABASE_URL...');
      pool = mysql.createPool({
        uri: connectionUri,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    } else {
      console.log('Connecting to MySQL using individual parameters...');
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bmt_db',
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
  }
  return pool;
}

/**
 * Executes a query using the connection pool.
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const db = getDbPool();
  const [rows] = await db.execute(sql, params);
  return rows as T;
}

/**
 * Initializes the database by running the schema.sql script on startup.
 */
export async function initDb(): Promise<void> {
  try {
    const db = getDbPool();
    console.log('Initializing database schema...');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.log(`Schema file not found at ${schemaPath}, skipping auto-initialization.`);
      return;
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Clean up comments and split queries by semicolon to execute them one by one.
    const cleanSql = schemaSql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');

    const queries = cleanSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      for (const sqlQuery of queries) {
        await connection.query(sqlQuery);
      }
      await connection.commit();
      
      // Dynamically add columns to members if they don't exist
      try {
        await connection.query('ALTER TABLE members ADD COLUMN password_hash VARCHAR(255) DEFAULT NULL');
      } catch (e) {}
      try {
        await connection.query('ALTER TABLE members ADD COLUMN approved TINYINT(1) DEFAULT 0');
      } catch (e) {}
      try {
        await connection.query('ALTER TABLE permissions MODIFY COLUMN min_role VARCHAR(100) NOT NULL DEFAULT \'OWNER\'');
      } catch (e) {}

      console.log('Database initialized successfully.');
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Do not crash the server in local dev if connection fails, but log it.
  }
}
