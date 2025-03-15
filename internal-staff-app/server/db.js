const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',     
    user: 'root',           
    password: '0000',         
    database: 'data',   
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Export
module.exports = {
  pool,
  testConnection
};