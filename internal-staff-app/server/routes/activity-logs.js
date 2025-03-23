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
  -d "{"action_type\":\"CREATE_REQUEST\"}"
 */
router.post('/', async (req, res) => {
  const { action_type } = req.body;
  
  // Validate required fields
  if (!action_type) {
    return res.status(400).json({ error: 'Action type is required' });
  }
  
  try {
   
    const [result] = await pool.query(
      'INSERT INTO activity_logs (action_type) VALUES (?, ?)',
      [action_type]
    );
    
    res.status(201).json({
      log_id: result.insertId,
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