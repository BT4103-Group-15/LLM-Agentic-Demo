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
 * Get reports by project
 * GET /reports/project-details/:projectId
 * curl http://localhost:3000/reports/project-details/1
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
 * Create new report
 * POST /reports
 * curl -X POST http://localhost:3000/reports -H "Content-Type: application/json" -d "{\"project_id\":1,\"report_type\":\"REQUIREMENT_VALIDATION\",\"content\":{\"findings\":[\"Finding 1\"]},\"status\":\"DRAFT\"}"
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
 * Update report
 * PUT /reports/:id
 * curl -X PUT http://localhost:3000/reports/4 -H "Content-Type: application/json" -d "{\"content\":{\"findings\":[\"Updated Finding\"]},\"status\":\"SENT\"}"
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