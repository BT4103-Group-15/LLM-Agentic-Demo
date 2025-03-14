const express = require('express');
const { pool, testConnection } = require('./db');

const app = express();

app.use(express.json());

// Test the database connection when server starts
(async () => {
  await testConnection();
})();



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});