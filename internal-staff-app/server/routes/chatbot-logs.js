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
      SELECT cl.*, pr.pentest_request_id 
      FROM chatbot_logs cl
      LEFT JOIN pentest_requests pr ON cl.pentest_request_id = pr.pentest_request_id
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
      SELECT cl.*, pr.pentest_request_id 
      FROM chatbot_logs cl
      LEFT JOIN pentest_requests pr ON cl.pentest_request_id = pr.pentest_request_id
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
 * Get logs by pentest request ID
 * GET /chatbot-logs/pentest-request/:pentestRequestId
 * curl http://localhost:3000/chatbot-logs/pentest-request/1
 */
router.get('/pentest-request/:pentestRequestId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM chatbot_logs 
      WHERE pentest_request_id = ?
      ORDER BY timestamp DESC
    `, [req.params.pentestRequestId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pentest request logs:', error);
    res.status(500).json({ error: 'Failed to retrieve pentest request logs' });
  }
});

/**
 * Create new chatbot log
 * POST /chatbot-logs
 * curl -X POST http://localhost:3000/chatbot-logs \
  -H 'Content-Type: application/json' \
  -d '{"pentest_request_id":1,"chat_history":[{"role":"user","content":"Hello!"},{"role":"assistant","content":"Hi there!"}]}'
 */
  router.post('/', async (req, res) => {
    const { pentest_request_id, chat_history } = req.body;
    
    // Validate input
    if (!chat_history || !Array.isArray(chat_history)) {
      return res.status(400).json({ error: 'Valid chat history is required' });
    }
    
    try {
      // Check if pentest request exists if pentest_request_id is provided
      if (pentest_request_id) {
        const [requestRows] = await pool.query(
          'SELECT pentest_request_id FROM pentest_requests WHERE pentest_request_id = ?', 
          [pentest_request_id]
        );
        if (requestRows.length === 0) {
          return res.status(404).json({ error: 'Pentest request not found' });
        }
      }
      
      let query, params;
      
      if (pentest_request_id) {
        query = 'INSERT INTO chatbot_logs (pentest_request_id, chat_history) VALUES (?, ?)';
        params = [pentest_request_id, JSON.stringify(chat_history)];
      } else {
        query = 'INSERT INTO chatbot_logs (chat_history) VALUES (?)';
        params = [JSON.stringify(chat_history)];
      }
      
      const [result] = await pool.query(query, params);
      
      res.status(201).json({
        log_id: result.insertId,
        pentest_request_id,
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