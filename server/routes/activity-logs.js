const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");  // Or specify a particular origin instead of "*"
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});


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
 * Get activity log by ID
 * GET /activity-logs/:id
 * curl http://localhost:3000/activity-logs/1
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * from activity_logs WHERE log_id = ?`, [req.params.id]);
    
      if (rows.length === 0) {
      // No records found with this ID
      return res.status(404).json({ error: 'Activity log not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to retrieve activity log' });
  }
});


/**
 * Create activity log
 * POST /activity-logs
 * curl -X POST http://localhost:3000/activity-logs \
  -H "Content-Type: application/json" \
  -d '{"action_type":"CREATE_REQUEST","project_id":4}'
 */
router.post('/', async (req, res) => {
  const { action_type, project_id } = req.body;
  
  // Validate required fields
  if (!action_type) {
    return res.status(400).json({ error: 'Action type is required' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO activity_logs (action_type, project_id) VALUES (?, ?)',
      [action_type, project_id]
    );
    
    res.status(201).json({
      log_id: result.insertId,
      action_type,
      project_id,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ error: 'Failed to create activity log' });
  }
});

/**
 * Update activity log by ID
 * PUT /activity-logs/:id
 * curl -X PUT http://localhost:3000/activity-logs/5 \
   -H "Content-Type: application/json" \
   -d '{"action_type":"UPDATED_REQUEST","project_id":5}'
 */
   router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { action_type, project_id } = req.body;
    
    try {
      const [result] = await pool.query(
        'UPDATE activity_logs SET action_type = ?, project_id = ? WHERE log_id = ?',
        [action_type, project_id, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Activity log not found' });
      }
      
      res.json({
        log_id: id,
        action_type,
        project_id,
        message: 'Activity log updated successfully'
      });
    } catch (error) {
      console.error('Error updating activity log:', error);
      
      // Check if it's foreign key error
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ 
          error: 'Invalid project ID. The referenced project does not exist.' 
        });
      }
      
      res.status(500).json({ error: 'Failed to update activity log' });
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