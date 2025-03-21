const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * Get all reports
 * GET /reports
 * curl http://localhost:3000/reports
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
 * Get report by ID
 * GET /reports/:id
 * curl http://localhost:3000/reports/1
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
 * Get reports by pentest request
 * GET /reports/pentest-request/:pentestRequestId
 * curl http://localhost:3000/reports/pentest-request/1
 */
router.get('/pentest-request/:pentestRequestId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM reports WHERE pentest_request_id = ?', [req.params.pentestRequestId]);
    
    // If no reports found, return an empty array instead of a 404
    res.json(rows);
  } catch (error) {
    console.error('Error fetching pentest request reports:', error);
    res.status(500).json({ error: 'Failed to retrieve pentest request reports' });
  }
});

/**
 * Create new report
 * POST /reports
 * curl -X POST http://localhost:3000/reports \
  -H "Content-Type: application/json" \
  -d "{\"pentest_request_id\":1,\"report_type\":\"REQUIREMENT_VALIDATION\",\"content\":{\"findings\":[\"Finding 1\"]},\"created_by\":1}"
 */
  router.post('/', async (req, res) => {
    const { pentest_request_id, report_type, content, created_by, status = 'DRAFT' } = req.body;
    
    if (!pentest_request_id || !report_type || !content || !created_by) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      // Verify pentest request exists
      const [requestRows] = await pool.query(
        'SELECT * FROM pentest_requests WHERE pentest_request_id = ?', 
        [pentest_request_id]
      );
      
      if (requestRows.length === 0) {
        return res.status(404).json({ error: 'Pentest request not found' });
      }
      
      // Verify user exists
      const [userRows] = await pool.query(
        'SELECT * FROM users WHERE user_id = ?', 
        [created_by]
      );
      
      if (userRows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const [result] = await pool.query(
        'INSERT INTO reports (pentest_request_id, report_type, content, status, created_by) VALUES (?, ?, ?, ?, ?)',
        [pentest_request_id, report_type, JSON.stringify(content), status, created_by]
      );
      
      // Log the activity
      try {
        await pool.query(
          'INSERT INTO activity_logs (user_id, pentest_request_id, action_type) VALUES (?, ?, ?)',
          [created_by, pentest_request_id, 'GENERATE_REPORT']
        );
      } catch (logError) {
        console.warn('Unable to log activity:', logError.message);
      }
      
      res.status(201).json({ 
        report_id: result.insertId,
        pentest_request_id,
        report_type,
        content,
        status,
        created_by,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ 
        error: 'Failed to create report', 
        details: error.message 
      });
    }
  });

/**
 * Update report
 * PUT /reports/:id
 * curl -X PUT http://localhost:3000/reports/4 \
  -H "Content-Type: application/json" \
  -d "{\"content\":{\"findings\":[\"Updated Finding\"]},\"status\":\"SENT\"}"
 */
router.put('/:id', async (req, res) => {
  const updates = [];
  const values = [];
  
  // Build dynamic update query
  if (req.body.report_type) {
    updates.push('report_type = ?');
    values.push(req.body.report_type);
  }
  
  if (req.body.content) {
    updates.push('content = ?');
    values.push(JSON.stringify(req.body.content));
  }
  
  if (req.body.status) {
    updates.push('status = ?');
    values.push(req.body.status);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No update fields provided' });
  }
  
  try {
    // First get the existing report to get the user ID for logging
    const [existingReport] = await pool.query(
      'SELECT created_by FROM reports WHERE report_id = ?',
      [req.params.id]
    );
    
    if (existingReport.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Add the ID to the query values
    values.push(req.params.id);
    
    // Update the report
    const [result] = await pool.query(
      `UPDATE reports SET ${updates.join(', ')} WHERE report_id = ?`,
      values
    );
    
    // Log the activity
    try {
      await pool.query(
        'INSERT INTO activity_logs (user_id, action_type) VALUES (?, ?)',
        [existingReport[0].created_by, 'GENERATE_REPORT']
      );
    } catch (logError) {
      console.warn('Unable to log activity:', logError.message);
    }
    
    const [rows] = await pool.query('SELECT * FROM reports WHERE report_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

/**
 * Delete report
 * DELETE /reports/:id
 * curl -X DELETE http://localhost:3000/reports/1
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