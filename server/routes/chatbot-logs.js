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
 * @api {get} /chatbot-logs Get all chatbot logs
 * @apiGroup ChatbotLogs
 * 
 * @apiSuccess {Object[]} logs List of chatbot logs
 * @apiSuccess {Number} logs.log_id Unique identifier of the log
 * @apiSuccess {Number} logs.project_id Project identifier (if available)
 * @apiSuccess {Object[]} logs.chat_history Array of chat messages
 * @apiSuccess {Date} logs.timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "log_id": 1,
 *       "project_id": 123,
 *       "chat_history": [{...}],
 *       "timestamp": "2025-04-12T15:30:45.000Z"
 *     },
 *     {
 *       "log_id": 2,
 *       "project_id": null,
 *       "chat_history": [{...}],
 *       "timestamp": "2025-04-12T16:20:10.000Z"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve chatbot logs"
 *   }
 */

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM chatbot_logs
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching chatbot logs:', error);
    res.status(500).json({ error: 'Failed to retrieve chatbot logs' });
  }
});

/**
 * @api {get} /chatbot-logs/:id Get chatbot log by ID
 * @apiGroup ChatbotLogs
 * 
 * @apiParam {Number} id Chatbot log's ID
 * 
 * @apiSuccess {Number} log_id Unique identifier of the log
 * @apiSuccess {Number} project_id Project identifier (if available)
 * @apiSuccess {Object[]} chat_history Array of chat messages
 * @apiSuccess {Date} timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "log_id": 1,
 *     "project_id": 123,
 *     "chat_history": [{...}],
 *     "timestamp": "2025-04-12T15:30:45.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Chatbot log not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve chatbot log"
 *   }
 */

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM chatbot_logs where log_id = ?
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
 * @api {get} /chatbot-logs/project-details/:projectId Get chatbot logs by project ID
 * @apiGroup ChatbotLogs
 * 
 * @apiParam {Number} projectId Project's ID
 * 
 * @apiSuccess {Object[]} logs List of chatbot logs for the specified project
 * @apiSuccess {Number} logs.log_id Unique identifier of the log
 * @apiSuccess {Number} logs.project_id Project identifier
 * @apiSuccess {Object[]} logs.chat_history Array of chat messages
 * @apiSuccess {Date} logs.timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "log_id": 1,
 *       "project_id": 123,
 *       "chat_history": [{...}],
 *       "timestamp": "2025-04-12T15:30:45.000Z"
 *     },
 *     {
 *       "log_id": 3,
 *       "project_id": 123,
 *       "chat_history": [{...}],
 *       "timestamp": "2025-04-12T17:15:22.000Z"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve project details"
 *   }
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
 * @api {post} /chatbot-logs Create a new chatbot log
 * @apiGroup ChatbotLogs
 * 
 * @apiParam {Number} [project_id] Project's ID (optional)
 * @apiParam {Object[]} chat_history Array of chat messages
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "project_id": 123,
 *     "chat_history": [
 *       {"role": "user", "content": "Hello"},
 *       {"role": "assistant", "content": "Hi there! How can I help you today?"}
 *     ]
 *   }
 * 
 * @apiSuccess {Number} log_id Unique identifier of the created log
 * @apiSuccess {Number} project_id Project identifier (if provided)
 * @apiSuccess {Object[]} chat_history Array of chat messages
 * @apiSuccess {Date} timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "log_id": 4,
 *     "project_id": 123,
 *     "chat_history": [
 *       {"role": "user", "content": "Hello"},
 *       {"role": "assistant", "content": "Hi there! How can I help you today?"}
 *     ],
 *     "timestamp": "2025-04-12T18:45:30.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Valid chat content is required"
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project details not found. The referenced project does not exist."
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to create chatbot log",
 *     "details": "Error message details"
 *   }
 */
  router.post('/', async (req, res) => {
    const { project_id, chat_history } = req.body;
    
    // Validate input
    if (!chat_history || !Array.isArray(chat_history)) {
      return res.status(400).json({ error: 'Valid chat content is required' });
    }
    
    try {
      // Check if project id exists if project_id is provided
      if (project_id) {
        const [requestRows] = await pool.query(
          'SELECT project_id FROM project_details WHERE project_id = ?', 
          [project_id]
        );
        if (requestRows.length === 0) {
          return res.status(404).json({ error: 'Project details not found. The referenced project does not exist.' });
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
 * @api {delete} /chatbot-logs/:id Delete chatbot log
 * @apiGroup ChatbotLogs
 * 
 * @apiParam {Number} id Chatbot log's ID
 * 
 * @apiSuccess {null} null No content on success
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Chatbot log not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to delete chatbot log"
 *   }
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