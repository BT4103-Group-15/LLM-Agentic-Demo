const express = require('express');
const { pool, testConnection } = require('./db');

// import all routes
const usersRoutes = require('./routes/users');
const projectDetailsRoutes = require('./routes/project-details');
const reportsRoutes = require('./routes/reports');
const activityLogsRoutes = require('./routes/activity-logs');
const clientsRoutes = require('./routes/clients');
const chatbotLogsRoutes = require('./routes/chatbot-logs')
const projectActionLogsRoutes = require('./routes/project-action-logs')

const app = express();
app.use(express.json());

// Test the database connection when server starts
(async () => {
  await testConnection();
})();


// Mount all routes
app.use('/users', usersRoutes);
app.use('/project-details', projectDetailsRoutes);
app.use('/reports', reportsRoutes);
app.use('/activity-logs', activityLogsRoutes);
app.use('/clients', clientsRoutes);
app.use('/chatbot-logs', chatbotLogsRoutes)
app.use('/project-action-logs', projectActionLogsRoutes)


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});