const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * Get all users
 * GET /users
 * curl http://localhost:3000/users
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

/**
 * Get user by ID
 * GET /users/:id
 * curl http://localhost:3000/users/1
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

/**
 * Create new user
 * POST /users
 * curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"role\":\"SALES\"}
 */
router.post('/', async (req, res) => {
  const { name, role } = req.body;
  
  // Validate input
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }
  
  // Validate role enum
  const validRoles = ['SALES', 'TECH_PRE_SALES', 'PROJECT_MANAGER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ 
      error: 'Invalid role. Must be one of: SALES, TECH_PRE_SALES, PROJECT_MANAGER' 
    });
  }
  
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, role) VALUES (?, ?)',
      [name, role]
    );
    res.status(201).json({ 
      user_id: result.insertId,
      name,
      role
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * Update user
 * PUT /users/:id
 * curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Smith\",\"role\":\"PROJECT_MANAGER\"}"
 */
router.put('/:id', async (req, res) => {
  const { name, role } = req.body;
  
  // Validate input
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }
  
  // Validate role enum
  const validRoles = ['SALES', 'TECH_PRE_SALES', 'PROJECT_MANAGER'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ 
      error: 'Invalid role. Must be one of: SALES, TECH_PRE_SALES, PROJECT_MANAGER' 
    });
  }
  
  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, role = ? WHERE user_id = ?',
      [name, role, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user_id: parseInt(req.params.id), name, role });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * Delete user
 * DELETE /users/:id
 * curl -X DELETE http://localhost:3000/users/1
 */
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;