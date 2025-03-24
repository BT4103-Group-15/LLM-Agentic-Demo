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
 * Get all project action logs
 * GET /project-action-logs
 * curl http://localhost:3000/project-action-logs
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM project_action_logs ORDER BY timestamp DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project action logs:', error);
    res.status(500).json({ error: 'Failed to retrieve project action logs' });
  }
});

/**
 * Get project action logs by project ID
 * GET /project-action-logs/project/:projectId
 * curl http://localhost:3000/project-action-logs/project/1
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM project_action_logs WHERE project_id = ? ORDER BY timestamp DESC', 
      [req.params.projectId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No action logs found for this project' });
    }
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project action logs:', error);
    res.status(500).json({ error: 'Failed to retrieve project action logs' });
  }
});

/**
 * Get project action log by ID
 * GET /project-action-logs/:id
 * curl http://localhost:3000/project-action-logs/1
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM project_action_logs WHERE log_id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project action log not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching project action log:', error);
    res.status(500).json({ error: 'Failed to retrieve project action log' });
  }
});

/**
 * Create new project action log
 * POST /project-action-logs
  curl -X POST http://localhost:3000/project-action-logs \
   -H "Content-Type: application/json" \
   -d "{\"project_id\":1,\"action_type\":\"SCOPING_SHEET_SUBMISSION\"}"
 */
router.post('/', async (req, res) => {
  const { project_id, action_type } = req.body;
  
  // Validate input
  if (!project_id || !action_type) {
    return res.status(400).json({ error: 'Project ID and action type are required' });
  }
  
  // Validate action type enum
  const validActionTypes = [
    'SCOPING_SHEET_SUBMISSION',
    'SCOPING_SHEET_APPROVAL',
    'SOW_DRAFTING_TRIGGERED',
    'DRAFT_SOW_SUBMISSION',
    'SOW_APPROVAL',
    'FINAL_SOW_SENT_TO_CLIENT'
  ];
  
  if (!validActionTypes.includes(action_type)) {
    return res.status(400).json({
      error: `Invalid action type. Must be one of: ${validActionTypes.join(', ')}`
    });
  }
  
  try {
    // Check if project exists
    const [projectCheck] = await pool.query(
      'SELECT 1 FROM project_details WHERE project_id = ?',
      [project_id]
    );
    
    if (projectCheck.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO project_action_logs (project_id, action_type) VALUES (?, ?)',
      [project_id, action_type]
    );
    
    // Get the created log
    const [newLog] = await pool.query(
      'SELECT * FROM project_action_logs WHERE log_id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newLog[0]);
  } catch (error) {
    console.error('Error creating project action log:', error);
    res.status(500).json({ error: 'Failed to create project action log' });
  }
});

/**
 * Delete project action log
 * DELETE /project-action-logs/:id
 * curl -X DELETE http://localhost:3000/project-action-logs/1
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM project_action_logs WHERE log_id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project action log not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project action log:', error);
    res.status(500).json({ error: 'Failed to delete project action log' });
  }
});

module.exports = router;