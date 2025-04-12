const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * @api {get} /reports Get all reports
 * @apiGroup Reports
 * 
 * @apiSuccess {Object[]} reports List of reports
 * @apiSuccess {Number} reports.report_id Unique identifier of the report
 * @apiSuccess {Number} reports.project_id Project identifier
 * @apiSuccess {String} reports.report_type Type of report
 * @apiSuccess {Object} reports.content Report content
 * @apiSuccess {String} reports.status Report status
 * @apiSuccess {Date} reports.timestamp Creation timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "report_id": 1,
 *       "project_id": 1,
 *       "report_type": "REQUIREMENT_VALIDATION",
 *       "content": {"findings": ["Finding 1"]},
 *       "status": "DRAFT",
 *       "timestamp": "2025-04-11T15:30:45.000Z"
 *     },
 *     {
 *       "report_id": 2,
 *       "project_id": 2,
 *       "report_type": "FINAL_REPORT",
 *       "content": {"findings": ["Critical Issue Found"]},
 *       "status": "SENT",
 *       "timestamp": "2025-04-12T10:45:22.000Z"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve reports"
 *   }
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reports');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

/**
 * @api {get} /reports/:id Get report by ID
 * @apiGroup Reports
 * 
 * @apiParam {Number} id Report's unique ID
 * 
 * @apiSuccess {Number} report_id Unique identifier of the report
 * @apiSuccess {Number} project_id Project identifier
 * @apiSuccess {String} report_type Type of report
 * @apiSuccess {Object} content Report content
 * @apiSuccess {String} status Report status
 * @apiSuccess {Date} timestamp Creation timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "report_id": 1,
 *     "project_id": 1,
 *     "report_type": "REQUIREMENT_VALIDATION",
 *     "content": {"findings": ["Finding 1"]},
 *     "status": "DRAFT",
 *     "timestamp": "2025-04-11T15:30:45.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Report not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve report"
 *   }
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reports WHERE report_id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to retrieve report' });
  }
});

/**
 * @api {get} /reports/:id Get report by ID
 * @apiGroup Reports
 * 
 * @apiParam {Number} id Report's unique ID
 * 
 * @apiSuccess {Number} report_id Unique identifier of the report
 * @apiSuccess {Number} project_id Project identifier
 * @apiSuccess {String} report_type Type of report
 * @apiSuccess {Object} content Report content
 * @apiSuccess {String} status Report status
 * @apiSuccess {Date} timestamp Creation timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "report_id": 1,
 *     "project_id": 1,
 *     "report_type": "REQUIREMENT_VALIDATION",
 *     "content": {"findings": ["Finding 1"]},
 *     "status": "DRAFT",
 *     "timestamp": "2025-04-11T15:30:45.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Report not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve report"
 *   }
 */
router.get('/project-details/:projectId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reports WHERE project_id = ?', [req.params.projectId]);
    
    // If no reports found, return an empty array instead of a 404
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project reports:', error);
    res.status(500).json({ error: 'Failed to retrieve project reports' });
  }
});

/**
 * @api {post} /reports Create new report
 * @apiGroup Reports
 * 
 * @apiParam {Number} project_id Project's unique ID
 * @apiParam {String} report_type Type of report
 * @apiParam {Object} content Report content
 * @apiParam {String} [status="DRAFT"] Report status
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "project_id": 1,
 *     "report_type": "REQUIREMENT_VALIDATION",
 *     "content": {"findings": ["Finding 1"]},
 *     "status": "DRAFT"
 *   }
 * 
 * @apiSuccess {Number} report_id Unique identifier of the created report
 * @apiSuccess {Number} project_id Project identifier
 * @apiSuccess {String} report_type Type of report
 * @apiSuccess {Object} content Report content
 * @apiSuccess {String} status Report status
 * @apiSuccess {Date} timestamp Creation timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "report_id": 4,
 *     "project_id": 1,
 *     "report_type": "REQUIREMENT_VALIDATION",
 *     "content": {"findings": ["Finding 1"]},
 *     "status": "DRAFT",
 *     "timestamp": "2025-04-12T16:45:30.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Missing required fields"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to create report"
 *   }
 */
router.post('/', async (req, res) => {
  const { project_id, report_type, content, status = 'DRAFT' } = req.body;
  
  if (!project_id || !report_type || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Insert the report
    const [result] = await pool.query(
      'INSERT INTO reports (project_id, report_type, content, status) VALUES (?, ?, ?, ?)',
      [project_id, report_type, JSON.stringify(content), status]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (project_id, action_type) VALUES (?, ?)',
      [project_id, 'GENERATE_REPORT']
    );
    
    res.status(201).json({ 
      report_id: result.insertId,
      project_id,
      report_type,
      content,
      status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

/**
 * @api {put} /reports/:id Update report
 * @apiGroup Reports
 * 
 * @apiParam {Number} id Report's unique ID
 * @apiParam {String} [report_type] Type of report
 * @apiParam {Object} [content] Report content
 * @apiParam {String} [status] Report status
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "content": {"findings": ["Updated Finding"]},
 *     "status": "SENT"
 *   }
 * 
 * @apiSuccess {Number} report_id Unique identifier of the report
 * @apiSuccess {Number} project_id Project identifier
 * @apiSuccess {String} report_type Type of report
 * @apiSuccess {Object} content Updated report content
 * @apiSuccess {String} status Updated report status
 * @apiSuccess {Date} timestamp Creation timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "report_id": 1,
 *     "project_id": 1,
 *     "report_type": "REQUIREMENT_VALIDATION",
 *     "content": {"findings": ["Updated Finding"]},
 *     "status": "SENT",
 *     "timestamp": "2025-04-11T15:30:45.000Z"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "No update fields provided"
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Report not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to update report"
 *   }
 */
router.put('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    const { report_type, content, status } = req.body;
    const updates = [];
    const values = [];
    
    // Dynamic update query
    if (report_type) {
      updates.push('report_type = ?');
      values.push(report_type);
    }
    
    if (content) {
      updates.push('content = ?');
      values.push(JSON.stringify(content));
    }
    
    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No update fields provided' });
    }
    
    // Get project_id for activity logging
    const [report] = await pool.query('SELECT project_id FROM reports WHERE report_id = ?', [reportId]);
    if (report.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Add ID to values array
    values.push(reportId);
    
    // Update report
    await pool.query(`UPDATE reports SET ${updates.join(', ')} WHERE report_id = ?`, values);
    
    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (project_id, action_type) VALUES (?, ?)',
      [report[0].project_id, 'GENERATE_REPORT']
    );
    
    // Get updated report
    const [updated] = await pool.query('SELECT * FROM reports WHERE report_id = ?', [reportId]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

/**
 * @api {delete} /reports/:id Delete report
 * @apiGroup Reports
 * 
 * @apiParam {Number} id Report's unique ID
 * 
 * @apiSuccess {null} null No content on success
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Report not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to delete report"
 *   }
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM reports WHERE report_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;