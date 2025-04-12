const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});


/**
 * @api {get} /activity-logs Get all activity logs
 * @apiGroup ActivityLogs
 * 
 * @apiSuccess {Object[]} logs List of activity logs
 * @apiSuccess {Number} logs.log_id Unique identifier of the log
 * @apiSuccess {Number} logs.project_id ID of the associated project
 * @apiSuccess {String} logs.action_type Type of action recorded
 * @apiSuccess {DateTime} logs.timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "log_id": 1,
 *       "project_id": 4,
 *       "action_type": "CREATE_REQUEST",
 *       "timestamp": "2025-04-08T15:30:00Z"
 *     },
 *     {
 *       "log_id": 2,
 *       "project_id": 5,
 *       "action_type": "UPDATE_REQUEST",
 *       "timestamp": "2025-04-08T16:45:00Z"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve activity logs"
 *   }
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
 * @api {get} /activity-logs/:id Get activity log by ID
 * @apiGroup ActivityLogs
 * 
 * @apiParam {Number} id Activity log's ID
 * 
 * @apiSuccess {Object} log Activity log details
 * @apiSuccess {Number} log.log_id Unique identifier of the log
 * @apiSuccess {Number} log.project_id ID of the associated project
 * @apiSuccess {String} log.action_type Type of action recorded
 * @apiSuccess {DateTime} log.timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "log_id": 1,
 *     "project_id": 4,
 *     "action_type": "CREATE_REQUEST",
 *     "timestamp": "2025-04-08T15:30:00Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Activity log not found"
 *   }
 *
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve activity log"
 *   }
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
 * @api {post} /activity-logs Create activity log
 * @apiGroup ActivityLogs
 * 
 * @apiParam {String} action_type Type of action (required)
 * @apiParam {Number} project_id ID of the project (optional)
 * 
 * @apiParamExample {json} Request-Body:
 *   {
 *     "action_type": "CREATE_REQUEST",
 *     "project_id": 4
 *   }
 * 
 * @apiSuccess {Object} log Created activity log
 * @apiSuccess {Number} log.log_id Unique identifier of the created log
 * @apiSuccess {String} log.action_type Type of action recorded
 * @apiSuccess {Number} log.project_id ID of the associated project
 * @apiSuccess {DateTime} log.timestamp Time when the log was created
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "log_id": 5,
 *     "action_type": "CREATE_REQUEST",
 *     "project_id": 4,
 *     "timestamp": "2025-04-08T17:30:00Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Missing-Param-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Action type is required"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to create activity log"
 *   }
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
 * @api {put} /activity-logs/:id Update activity log
 * @apiGroup ActivityLogs
 * 
 * @apiParam {Number} id Activity log's ID
 * @apiParam {String} action_type Updated action type
 * @apiParam {Number} project_id Updated project ID
 * 
 * @apiParamExample {json} Request-Body:
 *   {
 *     "action_type": "UPDATED_REQUEST",
 *     "project_id": 5
 *   }
 * 
 * @apiSuccess {Object} result Update result
 * @apiSuccess {String} result.log_id ID of the updated log
 * @apiSuccess {String} result.action_type Updated action type
 * @apiSuccess {Number} result.project_id Updated project ID
 * @apiSuccess {String} result.message Success message
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "log_id": "5",
 *     "action_type": "UPDATED_REQUEST",
 *     "project_id": 5,
 *     "message": "Activity log updated successfully"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Activity log not found"
 *   }
 * 
 * @apiErrorExample {json} Invalid-Project-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Invalid project ID. The referenced project does not exist."
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to update activity log"
 *   }
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
 * @api {delete} /activity-logs/:id Delete activity log
 * @apiGroup ActivityLogs
 * 
 * @apiParam {Number} id Activity log's ID
 * 
 * @apiSuccess {null} null No content on success
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Activity log not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to delete activity log"
 *   }
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