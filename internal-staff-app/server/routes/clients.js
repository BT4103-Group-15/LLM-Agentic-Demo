const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * Get all clients
 * GET /clients
 * curl http://localhost:3000/clients
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
 * Get client by ID
 * GET /clients/:id
 * curl http://localhost:3000/clients/1
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
 * Create new client
 * POST /clients
 * curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d "{\"company_name\":\"Acme Corp\",\"contact_name\":\"John Doe\",\"email\":\"john@acme.com\"}"
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
 * Update client
 * PUT /clients/:id
 * curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d "{\"company_name\":\"Acme Corp\",\"contact_name\":\"John Doe\",\"email\":\"john@acme.com\"}
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
 * Delete client
 * DELETE /clients/:id
 * curl -X DELETE http://localhost:3000/clients/1
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
    
    return res.status(400).json({ 
      error: 'Foreign key constraint: Cannot delete client with associated records'
    });
  }
});

module.exports = router;