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
 * Get all project details
 * GET /project-details
 * curl http://localhost:3000/project-details
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM project_details
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
});

/**
 * Get project details by ID
 * GET /project-details/:id
 * curl http://localhost:3000/project-details/1
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM project_details WHERE project_id = ?', 
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to retrieve project details' });
  }
});

/**
 * Get project details by client ID
 * GET /project-details/client/:clientId
 * curl http://localhost:3000/project-details/client/1
 */
router.get('/client/:clientId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * 
      FROM project_details 
      WHERE client_id = ?
    `, [req.params.clientId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching client project:', error);
    res.status(500).json({ error: 'Failed to retrieve client project details' });
  }
});

/**
 * Create new project
 * POST /project-details
 * curl -X POST http://localhost:3000/project-details \
  -H "Content-Type: application/json" \
  -d "{\"client_id\":1,\"application_name\":\"Web App Security Test\",\"production_url\":\"https://example.com\",\"testing_environment\":\"Staging\",\"application_type\":\"Web Application\"}"
 */
router.post('/', async (req, res) => {
  const { 
    client_id, 
    application_name,
    production_url,
    testing_environment,
    application_type,
    authentication_method,
    user_roles,
    session_management,
    session_timeout_period,
    total_num_input_fields,
    input_types_present,
    sensitive_data_handled,
    data_storage,
    number_of_endpoints,
    authentication_required,
    rate_limiting,
    documentation_available,
    security_controls_present,
    hosting,
    critical_functions,
    compliance_requirements,
    previous_testing,
    time_restrictions,
    testing_limitations,
    required_reports,
    project_start_date,
    draft_report_due_date,
    final_report_due_date
  } = req.body;
  
  // Basic input validation
  if (!client_id || !application_name) {
    return res.status(400).json({ error: 'Missing required fields (client_id and application_name are required)' });
  }
  
  try {
    // Verify client exists
    const [client] = await pool.query('SELECT client_id FROM clients WHERE client_id = ?', [client_id]);

    if (!client || client.length === 0) {
      return res.status(404).json({ error: 'Invalid client' });
    }
    
    // Insert project details
    const [result] = await pool.query(
      `INSERT INTO project_details (
        client_id, 
        application_name,
        production_url,
        testing_environment,
        application_type,
        authentication_method,
        user_roles,
        session_management,
        session_timeout_period,
        total_num_input_fields,
        input_types_present,
        sensitive_data_handled,
        data_storage,
        number_of_endpoints,
        authentication_required,
        rate_limiting,
        documentation_available,
        security_controls_present,
        hosting,
        critical_functions,
        compliance_requirements,
        previous_testing,
        time_restrictions,
        testing_limitations,
        required_reports,
        project_start_date,
        draft_report_due_date,
        final_report_due_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id, 
        application_name,
        production_url || null,
        testing_environment || null,
        application_type || null,
        authentication_method || null,
        user_roles || null,
        session_management || null,
        session_timeout_period || null,
        total_num_input_fields || null,
        input_types_present || null,
        sensitive_data_handled || null,
        data_storage || null,
        number_of_endpoints || null,
        authentication_required === undefined ? null : authentication_required,
        rate_limiting === undefined ? null : rate_limiting,
        documentation_available === undefined ? null : documentation_available,
        security_controls_present || null,
        hosting || null,
        critical_functions || null,
        compliance_requirements || null,
        previous_testing || null,
        time_restrictions || null,
        testing_limitations || null,
        required_reports || null,
        project_start_date || null,
        draft_report_due_date || null,
        final_report_due_date || null
      ]
    );
    
    // Log the activity of creating a new project
    await pool.query(
      'INSERT INTO activity_logs (project_id, action_type) VALUES (?, ?)',
      [result.insertId, 'CREATE_REQUEST']
    );
    
    // Fetch and return the created project
    const [newProject] = await pool.query(`
      SELECT * 
      FROM project_details
      WHERE project_id = ?
    `, [result.insertId]);
    
    res.status(201).json(newProject[0]);
  } catch (error) {
    console.error('Project details creation error:', error);
    res.status(500).json({ error: 'Project creation failed', details: error.message });
  }
});

/**
 * Update project details
 * PUT /project-details/:id
 * curl -X PUT http://localhost:3000/project-details/1 \
  -H "Content-Type: application/json" \
  -d "{\"application_name\":\"Updated App Security Test\",\"testing_environment\":\"Production-like environment\"}"
 */
router.put('/:id', async (req, res) => {
  const projectId = req.params.id;
  const updateData = req.body;
  
  // Ensure we have data to update
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
  }
  
  try {
    // Check if project exists
    const [projectRows] = await pool.query(
      'SELECT * FROM project_details WHERE project_id = ?', 
      [projectId]
    );
    
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Verify client exists if updating client_id
    if (updateData.client_id) {
      const [clientRows] = await pool.query('SELECT client_id FROM clients WHERE client_id = ?', [updateData.client_id]);
      if (clientRows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
    }
    
    // Update dynamically based on provided fields
    const updates = [];
    const values = [];
    
    const allowedFields = [
      'client_id', 
      'application_name',
      'production_url',
      'testing_environment',
      'application_type',
      'authentication_method',
      'user_roles',
      'session_management',
      'session_timeout_period',
      'total_num_input_fields',
      'input_types_present',
      'sensitive_data_handled',
      'data_storage',
      'number_of_endpoints',
      'authentication_required',
      'rate_limiting',
      'documentation_available',
      'security_controls_present',
      'hosting',
      'critical_functions',
      'compliance_requirements',
      'previous_testing',
      'time_restrictions',
      'testing_limitations',
      'required_reports',
      'project_start_date',
      'draft_report_due_date',
      'final_report_due_date'
    ];
    
    for (const field of allowedFields) {
      if (field in updateData) {
        updates.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }
    
    // Add project_id as the last parameter
    values.push(projectId);
    
    // Update project
    const [result] = await pool.query(
      `UPDATE project_details SET ${updates.join(', ')} WHERE project_id = ?`,
      values
    );
    
    // Log the activity of updating the project
    await pool.query(
      'INSERT INTO activity_logs (project_id, action_type) VALUES (?, ?)',
      [projectId, 'UPDATE_REQUEST']
    );
    
    // Get updated project with joined data
    const [updatedProject] = await pool.query(`
      SELECT *
      FROM project_details
      WHERE project_id = ?
    `, [projectId]);
    
    res.json(updatedProject[0]);
  } catch (error) {
    console.error('Error updating project details:', error);
    res.status(500).json({ error: 'Failed to update project details', details: error.message });
  }
});

/**
 * Delete project details
 * DELETE /project-details/:id
 * curl -X DELETE http://localhost:3000/project-details/1
 */
router.delete('/:id', async (req, res) => {
  try {
    // Check if project exists
    const [projectRows] = await pool.query(
      'SELECT * FROM project_details WHERE project_id = ?', 
      [req.params.id]
    );
    
    if (projectRows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
     
    // Delete project
    const [result] = await pool.query(
      'DELETE FROM project_details WHERE project_id = ?', 
      [req.params.id]
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project details:', error);
    
    res.status(500).json({ 
      error: 'Failed to delete project details', 
      details: error.message 
    });
  }
});

module.exports = router;