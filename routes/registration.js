const express = require('express');
const router = express.Router()

// Register New User (POST)
router.post('/register', async (req, res) => {
    try {
        // Extract user registration information from the request body
        const { username, password, email } = req.body;

        // Validate input data
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if a user with the same username or email already exists
        const existingUser = await pool.query('SELECT * FROM "User" WHERE username = $1 OR email = $2', [username, email]);

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with the same username or email already exists' });
        }

        // Insert the new user into the database
        const result = await pool.query('INSERT INTO "User" (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username, email', [username, password, email]);

        // Send the response
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;