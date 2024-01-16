const express = require('express');
const router = express.Router()

// Retrieve All Users (GET)
router.get('/users', async (req, res) => {
    try {
        // Query the database to get all users
        const { rows } = await pool.query('SELECT user_id, username, email FROM "User"');

        // Send the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving all users', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve Single User by ID (GET)
router.get('/users/:userId', async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Query the database to get a single user by ID
        const { rows } = await pool.query('SELECT user_id, username, email FROM "User" WHERE user_id = $1', [userId]);

        // Check if the user exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the response
        res.json(rows[0]);
    } catch (error) {
        console.error('Error retrieving user by ID', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update User by ID (PUT)
router.put('/users/:userId', async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Extract updated user information from the request body
        const { username, email } = req.body;

        // TODO: Add validation for required fields and format

        // Update the user in the database
        const result = await pool.query('UPDATE "User" SET username = $1, email = $2 WHERE user_id = $3 RETURNING user_id, username, email', [username, email, userId]);

        // Check if the user exists
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the response
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user by ID', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// View User Account (GET)
router.get('/api/users/:userId', async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Query the database to get user details
        const { rows } = await pool.query('SELECT user_id, username, email FROM "User" WHERE user_id = $1', [userId]);

        // Check if user exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the response
        res.json(rows[0]);
    } catch (error) {
        console.error('Error retrieving user account', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;