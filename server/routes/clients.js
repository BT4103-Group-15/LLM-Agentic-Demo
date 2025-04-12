const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * @api {get} /clients Get all clients
 * @apiGroup Clients
 * 
 * @apiSuccess {Object[]} clients List of clients
 * @apiSuccess {Number} clients.client_id Unique identifier of the client
 * @apiSuccess {String} clients.company_name Company name
 * @apiSuccess {String} clients.contact_name Contact person name
 * @apiSuccess {String} clients.email Email address
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *     {
 *       "client_id": 1,
 *       "company_name": "Acme Inc",
 *       "contact_name": "John Doe",
 *       "email": "john@acme.com"
 *     },
 *     {
 *       "client_id": 2,
 *       "company_name": "Widget Corp",
 *       "contact_name": "Jane Smith",
 *       "email": "jane@widgetcorp.com"
 *     }
 *   ]
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve clients"
 *   }
 */

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to retrieve clients' });
  }
});

/**
 * @api {get} /clients/:id Get client by ID
 * @apiGroup Clients
 * 
 * @apiParam {Number} id Client's unique ID
 * 
 * @apiSuccess {Number} client_id Unique identifier of the client
 * @apiSuccess {String} company_name Company name
 * @apiSuccess {String} contact_name Contact person name
 * @apiSuccess {String} email Email address
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "client_id": 1,
 *     "company_name": "Acme Inc",
 *     "contact_name": "John Doe",
 *     "email": "john@acme.com"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Client not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to retrieve client"
 *   }
 */

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to retrieve client' });
  }
});

/**
 * @api {post} /clients Create a new client
 * @apiGroup Clients
 * 
 * @apiParam {String} company_name Company name
 * @apiParam {String} contact_name Contact person name
 * @apiParam {String} email Email address
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "company_name": "New Company",
 *     "contact_name": "New Contact",
 *     "email": "contact@newcompany.com"
 *   }
 * 
 * @apiSuccess {Number} client_id Unique identifier of the created client
 * @apiSuccess {String} company_name Company name
 * @apiSuccess {String} contact_name Contact person name
 * @apiSuccess {String} email Email address
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *   {
 *     "client_id": 3,
 *     "company_name": "New Company",
 *     "contact_name": "New Contact",
 *     "email": "contact@newcompany.com"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Company name, contact name, and email are required"
 *   }
 * 
 * @apiErrorExample {json} Email-Format-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Invalid email format"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to create client"
 *   }
 */
router.post('/', async (req, res) => {
  const { company_name, contact_name, email } = req.body;
  
  // Validate input
  if (!company_name || !contact_name || !email) {
    return res.status(400).json({ error: 'Company name, contact name, and email are required' });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO clients (company_name, contact_name, email) VALUES (?, ?, ?)',
      [company_name, contact_name, email]
    );
    res.status(201).json({ 
      client_id: result.insertId,
      company_name,
      contact_name,
      email
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

/**
 * @api {put} /clients/:id Update client
 * @apiGroup Clients
 * 
 * @apiParam {Number} id Client's unique ID
 * @apiParam {String} [company_name] Company name
 * @apiParam {String} [contact_name] Contact person name
 * @apiParam {String} [email] Email address
 * 
 * @apiParamExample {json} Request-Example:
 *   {
 *     "company_name": "Updated Company Name",
 *     "email": "updated@email.com"
 *   }
 * 
 * @apiSuccess {Number} client_id Unique identifier of the client
 * @apiSuccess {String} company_name Updated company name
 * @apiSuccess {String} contact_name Contact person name
 * @apiSuccess {String} email Updated email address
 * 
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   {
 *     "client_id": 1,
 *     "company_name": "Updated Company Name",
 *     "contact_name": "John Doe",
 *     "email": "updated@email.com"
 *   }
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Bad-Request-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "At least one field must be provided for update"
 *   }
 * 
 * @apiErrorExample {json} Email-Format-Error:
 *   HTTP/1.1 400 Bad Request
 *   {
 *     "error": "Invalid email format"
 *   }
 * 
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Client not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to update client"
 *   }
 */

router.put('/:id', async (req, res) => {
  const { company_name, contact_name, email } = req.body;
  
  // Validate that at least one field is provided
  if (!company_name && !contact_name && !email) {
    return res.status(400).json({ error: 'At least one field must be provided for update' });
  }
  
  // Email validation if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }
  
  try {
    // Build dynamic update query based on provided fields
    const updates = [];
    const values = [];
    
    if (company_name) {
      updates.push('company_name = ?');
      values.push(company_name);
    }
    
    if (contact_name) {
      updates.push('contact_name = ?');
      values.push(contact_name);
    }
    
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    
    // Add client_id to values array
    values.push(req.params.id);
    
    const [result] = await pool.query(
      `UPDATE clients SET ${updates.join(', ')} WHERE client_id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Get updated client record
    const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

/**
 * @api {delete} /clients/:id Delete client
 * @apiGroup Clients
 * 
 * @apiParam {Number} id Client's unique ID
 * 
 * @apiDescription Deletes a client and all associated references due to ON DELETE CASCADE.
 * 
 * @apiSuccess {null} null No content on success
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * 
 * @apiError {Object} error Error message
 * @apiErrorExample {json} Not-Found-Error:
 *   HTTP/1.1 404 Not Found
 *   {
 *     "error": "Client not found"
 *   }
 * 
 * @apiErrorExample {json} Server-Error:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "error": "Failed to delete client"
 *   }
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clients WHERE client_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;