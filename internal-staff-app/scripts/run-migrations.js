const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../server/db');

async function runMigrations() {
  try {
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
          await pool.query(statement);
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
    // Close the connection pool
    pool.end();
  }
}

// Run migrations
runMigrations();