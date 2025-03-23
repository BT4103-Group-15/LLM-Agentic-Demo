const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * Get all chatbot logs
 * GET /chatbot-logs
 * curl http://localhost:3000/chatbot-logs
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cl.*, pr.project_id 
      FROM chatbot_logs cl
      LEFT JOIN project_id pr ON cl.project_id = pr.project_id
      ORDER BY cl.timestamp DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching chatbot logs:', error);
    res.status(500).json({ error: 'Failed to retrieve chatbot logs' });
  }
});

/**
 * Get chatbot log by ID
 * GET /chatbot-logs/:id
 * curl http://localhost:3000/chatbot-logs/1
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cl.*, pr.project_id 
      FROM chatbot_logs cl
      LEFT JOIN project_id pr ON cl.project_id = pr.project_id
      WHERE cl.log_id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Chatbot log not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching chatbot log:', error);
    res.status(500).json({ error: 'Failed to retrieve chatbot log' });
  }
});

/**
 * Get logs by project ID
 * GET /chatbot-logs/project-details/:projectId
 * curl http://localhost:3000/chatbot-logs/project-details/1
 */
router.get('/project-details/:projectId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM chatbot_logs 
      WHERE project_id = ?
      ORDER BY timestamp DESC
    `, [req.params.projectId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
});

/**
 * Create new chatbot log
 * POST /chatbot-logs
 * curl -X POST http://localhost:3000/chatbot-logs \
  -H 'Content-Type: application/json' \
  -d '{"project_id":1,"chat_history":[{"role":"user","content":"Hello!"},{"role":"assistant","content":"Hi there!"}]}'
 */
  router.post('/', async (req, res) => {
    const { project_id, chat_history } = req.body;
    
    // Validate input
    if (!chat_history || !Array.isArray(chat_history)) {
      return res.status(400).json({ error: 'Valid chat history is required' });
    }
    
    try {
      // Check if project id exists if project_id is provided
      if (project_id) {
        const [requestRows] = await pool.query(
          'SELECT project_id FROM project_id WHERE project_id = ?', 
          [project_id]
        );
        if (requestRows.length === 0) {
          return res.status(404).json({ error: 'Project details not found' });
        }
      }
      
      let query, params;
      
      if (project_id) {
        query = 'INSERT INTO chatbot_logs (project_id, chat_history) VALUES (?, ?)';
        params = [project_id, JSON.stringify(chat_history)];
      } else {
        query = 'INSERT INTO chatbot_logs (chat_history) VALUES (?)';
        params = [JSON.stringify(chat_history)];
      }
      
      const [result] = await pool.query(query, params);
      
      res.status(201).json({
        log_id: result.insertId,
        project_id,
        chat_history,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error creating chatbot log:', error);
      res.status(500).json({ 
        error: 'Failed to create chatbot log', 
        details: error.message 
      });
    }
  });

/**
 * Delete chatbot log
 * DELETE /chatbot-logs/:id
 * curl -X DELETE http://localhost:3000/chatbot-logs/1
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM chatbot_logs WHERE log_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Chatbot log not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting chatbot log:', error);
    res.status(500).json({ error: 'Failed to delete chatbot log' });
  }
});

module.exports = router;