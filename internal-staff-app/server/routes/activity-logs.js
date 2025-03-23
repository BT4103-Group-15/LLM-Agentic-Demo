const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * Get all activity logs
 * GET /activity-logs
 * curl http://localhost:3000/activity-logs
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * from activity_logs
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to retrieve activity logs' });
  }
});


/**
 * Create activity log (mostly used internally, but exposed for testing)
 * POST /activity-logs
 * curl -X POST http://localhost:3000/activity-logs \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":1,\"action_type\":\"CREATE_REQUEST\"}"
 */
router.post('/', async (req, res) => {
  const { user_id, action_type } = req.body;
  
  // Validate required fields
  if (!action_type) {
    return res.status(400).json({ error: 'Action type is required' });
  }
  
  // Validate action type
  const validActionTypes = ['CREATE_REQUEST', 'UPDATE_REQUEST', 'GENERATE_REPORT'];
  if (!validActionTypes.includes(action_type)) {
    return res.status(400).json({ 
      error: 'Invalid action type. Must be one of: CREATE_REQUEST, UPDATE_REQUEST, GENERATE_REPORT' 
    });
  }
  
  try {
    // Verify user exists
    const [userRows] = await pool.query('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO activity_logs (user_id, action_type) VALUES (?, ?)',
      [user_id, action_type]
    );
    
    res.status(201).json({
      log_id: result.insertId,
      user_id,
      action_type,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ error: 'Failed to create activity log' });
  }
});

/**
 * Delete activity log (mostly for cleanup/testing)
 * DELETE /activity-logs/:id
 * curl -X DELETE http://localhost:3000/activity-logs/1
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM activity_logs WHERE log_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Activity log not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting activity log:', error);
    res.status(500).json({ error: 'Failed to delete activity log' });
  }
});

module.exports = router;