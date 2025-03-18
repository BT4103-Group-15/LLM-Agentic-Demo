const express = require('express');
const { pool, testConnection } = require('./db');

// import all routes
const usersRoutes = require('./routes/users');
// const requestsRoutes = require('./routes/requests');
// const reportsRoutes = require('./routes/reports');
// const logsRoutes = require('./routes/logs');
// const clientsRoutes = require('./routes/clients');

const app = express();
app.use(express.json());

// Test the database connection when server starts
(async () => {
  await testConnection();
})();


// Mount all routes
app.use('/users', usersRoutes);
// app.use('/requests', requestsRoutes);
// app.use('/reports', reportsRoutes);
// app.use('/logs', logsRoutes);
// app.use('/clients', clientsRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});