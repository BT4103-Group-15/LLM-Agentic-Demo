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
 * @api {get} /project-action-logs Get all project action logs
 * @apiGroup ProjectActionLogs
 * 
 * @apiSuccess {Object[]} logs List of project action logs
 * @apiSuccess {Number} logs.log_id Unique identifier of the log
 * @apiSuccess {Number} logs.project_id Project identifier
 * @apiSuccess {String} logs.action_type Type of action performed
 * @apiSuccess {Date} logs.timestamp Time when the action was logged
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "log_id": 1,
 *       "project_id": 123,
 *       "action_type": "SCOPING_SHEET_SUBMISSION",
 *       "timestamp": "2025-04-11T15:30:45.000Z"
 *     },
 *     {
 *       "log_id": 2,
 *       "project_id": 456,
 *       "action_type": "SOW_APPROVAL",
 *       "timestamp": "2025-04-10T12:15:22.000Z"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve project action logs"
 *   }
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
 * @api {get} /project-action-logs/project/:projectId Get logs by project ID
 * @apiGroup ProjectActionLogs
 * 
 * @apiParam {Number} projectId Project's unique identifier
 * 
 * @apiSuccess {Object[]} logs List of project action logs for the specified project
 * @apiSuccess {Number} logs.log_id Unique identifier of the log
 * @apiSuccess {Number} logs.project_id Project identifier
 * @apiSuccess {String} logs.action_type Type of action performed
 * @apiSuccess {Date} logs.timestamp Time when the action was logged
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "log_id": 1,
 *       "project_id": 123,
 *       "action_type": "SCOPING_SHEET_SUBMISSION",
 *       "timestamp": "2025-04-11T15:30:45.000Z"
 *     },
 *     {
 *       "log_id": 3,
 *       "project_id": 123,
 *       "action_type": "SCOPING_SHEET_APPROVAL",
 *       "timestamp": "2025-04-12T09:45:30.000Z"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "No action logs found for this project"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve project action logs"
 *   }
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
 * @api {get} /project-action-logs/:id Get project action log by ID
 * @apiGroup ProjectActionLogs
 * 
 * @apiParam {Number} id Log's unique identifier
 * 
 * @apiSuccess {Number} log_id Unique identifier of the log
 * @apiSuccess {Number} project_id Project identifier
 * @apiSuccess {String} action_type Type of action performed
 * @apiSuccess {Date} timestamp Time when the action was logged
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "log_id": 1,
 *     "project_id": 123,
 *     "action_type": "SCOPING_SHEET_SUBMISSION",
 *     "timestamp": "2025-04-11T15:30:45.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project action log not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve project action log"
 *   }
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
 * @api {post} /project-action-logs Create new project action log
 * @apiGroup ProjectActionLogs
 * 
 * @apiParam {Number} project_id Project's unique identifier
 * @apiParam {String} action_type Type of action performed
 * 
 * @apiDescription The action_type must be one of the following values:
 * - SCOPING_SHEET_SUBMISSION
 * - SCOPING_SHEET_APPROVAL
 * - SOW_DRAFTING_TRIGGERED
 * - DRAFT_SOW_SUBMISSION
 * - SOW_APPROVAL
 * - FINAL_SOW_SENT_TO_CLIENT
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "project_id": 123,
 *     "action_type": "SCOPING_SHEET_SUBMISSION"
 *   }
 * 
 * @apiSuccess {Number} log_id Unique identifier of the created log
 * @apiSuccess {Number} project_id Project identifier
 * @apiSuccess {String} action_type Type of action performed
 * @apiSuccess {Date} timestamp Time when the action was logged
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "log_id": 4,
 *     "project_id": 123,
 *     "action_type": "SCOPING_SHEET_SUBMISSION",
 *     "timestamp": "2025-04-12T18:45:30.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Project ID and action type are required"
 *   }
 * 
 * @apiErrorExample {json} Invalid-Action-Type-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Invalid action type. Must be one of: SCOPING_SHEET_SUBMISSION, SCOPING_SHEET_APPROVAL, SOW_DRAFTING_TRIGGERED, DRAFT_SOW_SUBMISSION, SOW_APPROVAL, FINAL_SOW_SENT_TO_CLIENT"
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to create project action log"
 *   }
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
 * @api {put} /project-action-logs/:id Update project action log
 * @apiGroup ProjectActionLogs
 * 
 * @apiParam {Number} id Log's unique identifier
 * @apiParam {Number} project_id Project's unique identifier
 * @apiParam {String} action_type Type of action performed
 * 
 * @apiDescription The action_type must be one of the following values:
 * - SCOPING_SHEET_SUBMISSION
 * - SCOPING_SHEET_APPROVAL
 * - SOW_DRAFTING_TRIGGERED
 * - DRAFT_SOW_SUBMISSION
 * - SOW_APPROVAL
 * - FINAL_SOW_SENT_TO_CLIENT
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "project_id": 456,
 *     "action_type": "SOW_APPROVAL"
 *   }
 * 
 * @apiSuccess {Number} log_id Unique identifier of the log
 * @apiSuccess {Number} project_id Updated project identifier
 * @apiSuccess {String} action_type Updated action type
 * @apiSuccess {String} message Success message
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "log_id": "1",
 *     "project_id": 456,
 *     "action_type": "SOW_APPROVAL",
 *     "message": "Project action log updated successfully"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Project ID and action type are required"
 *   }
 * 
 * @apiErrorExample {json} Invalid-Action-Type-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Invalid action type. Must be one of: SCOPING_SHEET_SUBMISSION, SCOPING_SHEET_APPROVAL, SOW_DRAFTING_TRIGGERED, DRAFT_SOW_SUBMISSION, SOW_APPROVAL, FINAL_SOW_SENT_TO_CLIENT"
 *   }
 * 
 * @apiErrorExample {json} Invalid-Project-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Invalid project_id. The referenced project does not exist."
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project action log not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to update project action log"
 *   }
 */

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { project_id, action_type } = req.body;
  
  // Validate required fields
  if (!project_id || !action_type) {
    return res.status(400).json({ error: 'Project ID and action type are required' });
  }
  
  // Validate action_type is one of the allowed enum values
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
      error: 'Invalid action type. Must be one of: ' + validActionTypes.join(', ')
    });
  }
  
  try {
    const [result] = await pool.query(
      'UPDATE project_action_logs SET project_id = ?, action_type = ? WHERE log_id = ?',
      [project_id, action_type, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project action log not found' });
    }
    
    res.json({
      log_id: id,
      project_id,
      action_type,
      message: 'Project action log updated successfully'
    });
  } catch (error) {
    console.error('Error updating project action log:', error);
    
    // Handle foreign key constraint error
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ 
        error: 'Invalid project_id. The referenced project does not exist.' 
      });
    }
    
    res.status(500).json({ error: 'Failed to update project action log' });
  }
});

/**
 * @api {delete} /project-action-logs/:id Delete project action log
 * @apiGroup ProjectActionLogs
 * 
 * @apiParam {Number} id Log's unique identifier
 * 
 * @apiSuccess {null} null No content on success
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project action log not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to delete project action log"
 *   }
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