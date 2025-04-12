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
 * @api {get} /project-details Get all project details
 * @apiGroup ProjectDetails
 * 
 * @apiSuccess {Object[]} projects List of project details
 * @apiSuccess {Number} projects.project_id Unique identifier of the project
 * @apiSuccess {Number} projects.client_id Client identifier
 * @apiSuccess {String} projects.application_name Name of the application
 * @apiSuccess {String} projects.production_url Production URL of the application
 * @apiSuccess {String} projects.testing_environment Testing environment details
 * @apiSuccess {String} projects.application_type Type of application
 * @apiSuccess {String} projects.authentication_method Authentication method used
 * @apiSuccess {String} projects.user_roles User roles in the application
 * @apiSuccess {String} projects.session_management Session management details
 * @apiSuccess {String} projects.session_timeout_period Session timeout period
 * @apiSuccess {Number} projects.total_num_input_fields Total number of input fields
 * @apiSuccess {String} projects.input_types_present Types of input fields present
 * @apiSuccess {String} projects.sensitive_data_handled Sensitive data handled by the application
 * @apiSuccess {String} projects.data_storage Data storage details
 * @apiSuccess {Number} projects.number_of_endpoints Number of endpoints
 * @apiSuccess {Boolean} projects.authentication_required Whether authentication is required
 * @apiSuccess {Boolean} projects.rate_limiting Whether rate limiting is implemented
 * @apiSuccess {Boolean} projects.documentation_available Whether documentation is available
 * @apiSuccess {String} projects.security_controls_present Security controls present
 * @apiSuccess {String} projects.hosting Hosting details
 * @apiSuccess {String} projects.critical_functions Critical functions details
 * @apiSuccess {String} projects.compliance_requirements Compliance requirements
 * @apiSuccess {String} projects.previous_testing Previous testing details
 * @apiSuccess {String} projects.time_restrictions Time restrictions for testing
 * @apiSuccess {String} projects.testing_limitations Testing limitations
 * @apiSuccess {String} projects.required_reports Required reports
 * @apiSuccess {Date} projects.project_start_date Project start date
 * @apiSuccess {Date} projects.draft_report_due_date Draft report due date
 * @apiSuccess {Date} projects.final_report_due_date Final report due date
 * @apiSuccess {Date} projects.created_at Creation timestamp
 * @apiSuccess {Date} projects.updated_at Last update timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "project_id": 1,
 *       "client_id": 1,
 *       "application_name": "Web App Security Test",
 *       "production_url": "https://example.com",
 *       "testing_environment": "Staging",
 *       "application_type": "Web Application",
 *       ...
 *     },
 *     {
 *       "project_id": 2,
 *       "client_id": 1,
 *       "application_name": "Mobile App Security Test",
 *       "production_url": null,
 *       "testing_environment": "Development",
 *       "application_type": "Mobile Application",
 *       ...
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
 * @api {get} /project-details/:id Get project details by ID
 * @apiGroup ProjectDetails
 * 
 * @apiParam {Number} id Project's unique ID
 * 
 * @apiSuccess {Number} project_id Unique identifier of the project
 * @apiSuccess {Number} client_id Client identifier
 * @apiSuccess {String} application_name Name of the application
 * @apiSuccess {String} production_url Production URL of the application
 * @apiSuccess {String} testing_environment Testing environment details
 * @apiSuccess {String} application_type Type of application
 * @apiSuccess {String} authentication_method Authentication method used
 * @apiSuccess {String} user_roles User roles in the application
 * @apiSuccess {String} session_management Session management details
 * @apiSuccess {String} session_timeout_period Session timeout period
 * @apiSuccess {Number} total_num_input_fields Total number of input fields
 * @apiSuccess {String} input_types_present Types of input fields present
 * @apiSuccess {String} sensitive_data_handled Sensitive data handled by the application
 * @apiSuccess {String} data_storage Data storage details
 * @apiSuccess {Number} number_of_endpoints Number of endpoints
 * @apiSuccess {Boolean} authentication_required Whether authentication is required
 * @apiSuccess {Boolean} rate_limiting Whether rate limiting is implemented
 * @apiSuccess {Boolean} documentation_available Whether documentation is available
 * @apiSuccess {String} security_controls_present Security controls present
 * @apiSuccess {String} hosting Hosting details
 * @apiSuccess {String} critical_functions Critical functions details
 * @apiSuccess {String} compliance_requirements Compliance requirements
 * @apiSuccess {String} previous_testing Previous testing details
 * @apiSuccess {String} time_restrictions Time restrictions for testing
 * @apiSuccess {String} testing_limitations Testing limitations
 * @apiSuccess {String} required_reports Required reports
 * @apiSuccess {Date} project_start_date Project start date
 * @apiSuccess {Date} draft_report_due_date Draft report due date
 * @apiSuccess {Date} final_report_due_date Final report due date
 * @apiSuccess {Date} created_at Creation timestamp
 * @apiSuccess {Date} updated_at Last update timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "project_id": 1,
 *     "client_id": 1,
 *     "application_name": "Web App Security Test",
 *     "production_url": "https://example.com",
 *     "testing_environment": "Staging",
 *     "application_type": "Web Application",
 *     ...
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve project details"
 *   }
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
 * @api {get} /project-details/client/:clientId Get projects by client ID
 * @apiGroup ProjectDetails
 * 
 * @apiParam {Number} clientId Client's unique ID
 * 
 * @apiSuccess {Object[]} projects List of project details for the specified client
 * @apiSuccess {Number} projects.project_id Unique identifier of the project
 * @apiSuccess {Number} projects.client_id Client identifier
 * @apiSuccess {String} projects.application_name Name of the application
 * @apiSuccess {String} projects.production_url Production URL of the application
 * @apiSuccess {String} projects.testing_environment Testing environment details
 * @apiSuccess {String} projects.application_type Type of application
 * @apiSuccess {String} projects.authentication_method Authentication method used
 * @apiSuccess {String} projects.user_roles User roles in the application
 * @apiSuccess {String} projects.session_management Session management details
 * @apiSuccess {String} projects.session_timeout_period Session timeout period
 * @apiSuccess {Number} projects.total_num_input_fields Total number of input fields
 * @apiSuccess {String} projects.input_types_present Types of input fields present
 * @apiSuccess {String} projects.sensitive_data_handled Sensitive data handled by the application
 * @apiSuccess {String} projects.data_storage Data storage details
 * @apiSuccess {Number} projects.number_of_endpoints Number of endpoints
 * @apiSuccess {Boolean} projects.authentication_required Whether authentication is required
 * @apiSuccess {Boolean} projects.rate_limiting Whether rate limiting is implemented
 * @apiSuccess {Boolean} projects.documentation_available Whether documentation is available
 * @apiSuccess {String} projects.security_controls_present Security controls present
 * @apiSuccess {String} projects.hosting Hosting details
 * @apiSuccess {String} projects.critical_functions Critical functions details
 * @apiSuccess {String} projects.compliance_requirements Compliance requirements
 * @apiSuccess {String} projects.previous_testing Previous testing details
 * @apiSuccess {String} projects.time_restrictions Time restrictions for testing
 * @apiSuccess {String} projects.testing_limitations Testing limitations
 * @apiSuccess {String} projects.required_reports Required reports
 * @apiSuccess {Date} projects.project_start_date Project start date
 * @apiSuccess {Date} projects.draft_report_due_date Draft report due date
 * @apiSuccess {Date} projects.final_report_due_date Final report due date
 * @apiSuccess {Date} projects.created_at Creation timestamp
 * @apiSuccess {Date} projects.updated_at Last update timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "project_id": 1,
 *       "client_id": 1,
 *       "application_name": "Web App Security Test",
 *       "production_url": "https://example.com",
 *       "testing_environment": "Staging",
 *       "application_type": "Web Application",
 *       ...
 *     },
 *     {
 *       "project_id": 2,
 *       "client_id": 1,
 *       "application_name": "Mobile App Security Test",
 *       "production_url": null,
 *       "testing_environment": "Development",
 *       "application_type": "Mobile Application",
 *       ...
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve client project details"
 *   }
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
 * @api {post} /project-details Create new project
 * @apiGroup ProjectDetails
 * 
 * @apiParam {Number} client_id Client's unique ID (required)
 * @apiParam {String} application_name Name of the application (required)
 * @apiParam {String} [production_url] Production URL of the application
 * @apiParam {String} [testing_environment] Testing environment details
 * @apiParam {String} [application_type] Type of application
 * @apiParam {String} [authentication_method] Authentication method used
 * @apiParam {String} [user_roles] User roles in the application
 * @apiParam {String} [session_management] Session management details
 * @apiParam {String} [session_timeout_period] Session timeout period
 * @apiParam {Number} [total_num_input_fields] Total number of input fields
 * @apiParam {String} [input_types_present] Types of input fields present
 * @apiParam {String} [sensitive_data_handled] Sensitive data handled by the application
 * @apiParam {String} [data_storage] Data storage details
 * @apiParam {Number} [number_of_endpoints] Number of endpoints
 * @apiParam {Boolean} [authentication_required] Whether authentication is required
 * @apiParam {Boolean} [rate_limiting] Whether rate limiting is implemented
 * @apiParam {Boolean} [documentation_available] Whether documentation is available
 * @apiParam {String} [security_controls_present] Security controls present
 * @apiParam {String} [hosting] Hosting details
 * @apiParam {String} [critical_functions] Critical functions details
 * @apiParam {String} [compliance_requirements] Compliance requirements
 * @apiParam {String} [previous_testing] Previous testing details
 * @apiParam {String} [time_restrictions] Time restrictions for testing
 * @apiParam {String} [testing_limitations] Testing limitations
 * @apiParam {String} [required_reports] Required reports
 * @apiParam {Date} [project_start_date] Project start date
 * @apiParam {Date} [draft_report_due_date] Draft report due date
 * @apiParam {Date} [final_report_due_date] Final report due date
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "client_id": 1,
 *     "application_name": "Web App Security Test",
 *     "production_url": "https://example.com",
 *     "testing_environment": "Staging",
 *     "application_type": "Web Application"
 *   }
 * 
 * @apiSuccess {Number} project_id Unique identifier of the created project
 * @apiSuccess {Number} client_id Client identifier
 * @apiSuccess {String} application_name Name of the application
 * @apiSuccess {String} production_url Production URL of the application
 * @apiSuccess {String} testing_environment Testing environment details
 * @apiSuccess {String} application_type Type of application
 * @apiSuccess {String} authentication_method Authentication method used
 * @apiSuccess {String} user_roles User roles in the application
 * @apiSuccess {String} session_management Session management details
 * @apiSuccess {String} session_timeout_period Session timeout period
 * @apiSuccess {Number} total_num_input_fields Total number of input fields
 * @apiSuccess {String} input_types_present Types of input fields present
 * @apiSuccess {String} sensitive_data_handled Sensitive data handled by the application
 * @apiSuccess {String} data_storage Data storage details
 * @apiSuccess {Number} number_of_endpoints Number of endpoints
 * @apiSuccess {Boolean} authentication_required Whether authentication is required
 * @apiSuccess {Boolean} rate_limiting Whether rate limiting is implemented
 * @apiSuccess {Boolean} documentation_available Whether documentation is available
 * @apiSuccess {String} security_controls_present Security controls present
 * @apiSuccess {String} hosting Hosting details
 * @apiSuccess {String} critical_functions Critical functions details
 * @apiSuccess {String} compliance_requirements Compliance requirements
 * @apiSuccess {String} previous_testing Previous testing details
 * @apiSuccess {String} time_restrictions Time restrictions for testing
 * @apiSuccess {String} testing_limitations Testing limitations
 * @apiSuccess {String} required_reports Required reports
 * @apiSuccess {Date} project_start_date Project start date
 * @apiSuccess {Date} draft_report_due_date Draft report due date
 * @apiSuccess {Date} final_report_due_date Final report due date
 * @apiSuccess {Date} created_at Creation timestamp
 * @apiSuccess {Date} updated_at Last update timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "project_id": 3,
 *     "client_id": 1,
 *     "application_name": "Web App Security Test",
 *     "production_url": "https://example.com",
 *     "testing_environment": "Staging",
 *     "application_type": "Web Application",
 *     "created_at": "2025-04-12T15:30:45.000Z",
 *     "updated_at": "2025-04-12T15:30:45.000Z",
 *     ...
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Missing required fields (client_id and application_name are required)"
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Invalid client"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Project creation failed",
 *     "details": "Error message details"
 *   }
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
 * @api {put} /project-details/:id Update project details
 * @apiGroup ProjectDetails
 * 
 * @apiParam {Number} id Project's unique ID
 * @apiParam {Number} [client_id] Client's unique ID
 * @apiParam {String} [application_name] Name of the application
 * @apiParam {String} [production_url] Production URL of the application
 * @apiParam {String} [testing_environment] Testing environment details
 * @apiParam {String} [application_type] Type of application
 * @apiParam {String} [authentication_method] Authentication method used
 * @apiParam {String} [user_roles] User roles in the application
 * @apiParam {String} [session_management] Session management details
 * @apiParam {String} [session_timeout_period] Session timeout period
 * @apiParam {Number} [total_num_input_fields] Total number of input fields
 * @apiParam {String} [input_types_present] Types of input fields present
 * @apiParam {String} [sensitive_data_handled] Sensitive data handled by the application
 * @apiParam {String} [data_storage] Data storage details
 * @apiParam {Number} [number_of_endpoints] Number of endpoints
 * @apiParam {Boolean} [authentication_required] Whether authentication is required
 * @apiParam {Boolean} [rate_limiting] Whether rate limiting is implemented
 * @apiParam {Boolean} [documentation_available] Whether documentation is available
 * @apiParam {String} [security_controls_present] Security controls present
 * @apiParam {String} [hosting] Hosting details
 * @apiParam {String} [critical_functions] Critical functions details
 * @apiParam {String} [compliance_requirements] Compliance requirements
 * @apiParam {String} [previous_testing] Previous testing details
 * @apiParam {String} [time_restrictions] Time restrictions for testing
 * @apiParam {String} [testing_limitations] Testing limitations
 * @apiParam {String} [required_reports] Required reports
 * @apiParam {Date} [project_start_date] Project start date
 * @apiParam {Date} [draft_report_due_date] Draft report due date
 * @apiParam {Date} [final_report_due_date] Final report due date
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "application_name": "Updated App Security Test",
 *     "testing_environment": "Production-like environment"
 *   }
 * 
 * @apiSuccess {Number} project_id Unique identifier of the project
 * @apiSuccess {Number} client_id Client identifier
 * @apiSuccess {String} application_name Updated name of the application
 * @apiSuccess {String} production_url Production URL of the application
 * @apiSuccess {String} testing_environment Updated testing environment details
 * @apiSuccess {String} application_type Type of application
 * @apiSuccess {String} authentication_method Authentication method used
 * @apiSuccess {String} user_roles User roles in the application
 * @apiSuccess {String} session_management Session management details
 * @apiSuccess {String} session_timeout_period Session timeout period
 * @apiSuccess {Number} total_num_input_fields Total number of input fields
 * @apiSuccess {String} input_types_present Types of input fields present
 * @apiSuccess {String} sensitive_data_handled Sensitive data handled by the application
 * @apiSuccess {String} data_storage Data storage details
 * @apiSuccess {Number} number_of_endpoints Number of endpoints
 * @apiSuccess {Boolean} authentication_required Whether authentication is required
 * @apiSuccess {Boolean} rate_limiting Whether rate limiting is implemented
 * @apiSuccess {Boolean} documentation_available Whether documentation is available
 * @apiSuccess {String} security_controls_present Security controls present
 * @apiSuccess {String} hosting Hosting details
 * @apiSuccess {String} critical_functions Critical functions details
 * @apiSuccess {String} compliance_requirements Compliance requirements
 * @apiSuccess {String} previous_testing Previous testing details
 * @apiSuccess {String} time_restrictions Time restrictions for testing
 * @apiSuccess {String} testing_limitations Testing limitations
 * @apiSuccess {String} required_reports Required reports
 * @apiSuccess {Date} project_start_date Project start date
 * @apiSuccess {Date} draft_report_due_date Draft report due date
 * @apiSuccess {Date} final_report_due_date Final report due date
 * @apiSuccess {Date} created_at Creation timestamp
 * @apiSuccess {Date} updated_at Last update timestamp
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "project_id": 1,
 *     "client_id": 1,
 *     "application_name": "Updated App Security Test",
 *     "production_url": "https://example.com",
 *     "testing_environment": "Production-like environment",
 *     "application_type": "Web Application",
 *     "created_at": "2025-04-10T14:20:30.000Z",
 *     "updated_at": "2025-04-12T15:45:22.000Z",
 *     ...
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "No update data provided"
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project not found"
 *   }
 * 
 * @apiErrorExample {json} Client-Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Client not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to update project details",
 *     "details": "Error message details"
 *   }
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
 * @api {delete} /project-details/:id Delete project details
 * @apiGroup ProjectDetails
 * 
 * @apiParam {Number} id Project's unique ID
 * 
 * @apiDescription Deletes a project and all associated records due to ON DELETE CASCADE.
 * 
 * @apiSuccess {null} null No content on success
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Project not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to delete project details",
 *     "details": "Error message details"
 *   }
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