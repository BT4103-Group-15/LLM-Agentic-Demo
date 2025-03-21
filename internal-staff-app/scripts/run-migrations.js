const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigrations() {
  let rootConnection;
  let dbConnection;
  
  try {
    // First connect as root without specifying a database
    rootConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    // Create database if not exists
    console.log('Creating database if not exists...');
    await rootConnection.query('CREATE DATABASE IF NOT EXISTS data');
    console.log('Database "data" is ready');
    
    // Now create a connection with the database specified
    dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });
    
    // Get all migration files sorted by name
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = await fs.readdir(migrationsDir);
    
    // Filter for .sql files and sort them
    const sqlFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${sqlFiles.length} migration files to run`);
    
    // Execute each migration file in order
    for (const file of sqlFiles) {
      // Skip the database creation file if it exists
      if (file === '00_create_database.sql') {
        console.log(`Skipping ${file} - database already created`);
        continue;
      }
      
      console.log(`Running migration: ${file}`);
      
      // Read the SQL file content
      const filePath = path.join(migrationsDir, file);
      const sqlContent = await fs.readFile(filePath, 'utf8');
      
      // Split the content into individual statements (assuming ; as separator)
      const statements = sqlContent
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0);
      
      // Execute each statement
      for (const statement of statements) {
        try {
          await dbConnection.query(statement);
        } catch (err) {
          console.error(`Error executing statement from ${file}:`, err.message);
          console.error('Statement:', statement);
          throw err;
        }
      }
      
      console.log(`Migration ${file} completed successfully`);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    if (rootConnection) await rootConnection.end();
    if (dbConnection) await dbConnection.end();
  }
}

// Run migrations
runMigrations();