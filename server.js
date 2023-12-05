const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Database connection configuration
const pool = new Pool({
    user: 'your_database_user',
    host: 'your_database_host',
    database: 'your_database_name',
    password: 'your_database_password',
    port: 5432, // Default PostgreSQL port
});

// Middleware to parse JSON requests
app.use(express.json());

// Create an Account (POST)
app.post('/api/users', async (req, res) => {
    try {
        // Extract user registration information from the request body
        const { username, password, email } = req.body;

        // TODO: Validate input data

        // Insert the new user into the database
        const result = await pool.query('INSERT INTO "User" (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, password, email]);

        // Send the response
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user account', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// View User Account (GET)
app.get('/api/users/:userId', async (req, res) => {
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

// View Exercise Programs (GET)
app.get('/api/exercise-programs', async (req, res) => {
    try {
        // Query the database to get all exercise programs
        const { rows } = await pool.query('SELECT * FROM "ExerciseProgram"');

        // Send the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving exercise programs', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Buy Exercise Program (POST)
app.post('/api/users/:userId/buy-exercise-program', async (req, res) => {
    try {
        // Extract userId from request parameters
        const { userId } = req.params;

        // Extract exercise program details from the request body
        const { programId, paymentMethod } = req.body;

        // TODO: Validate input data

        // Insert the purchase record into the database
        const result = await pool.query('INSERT INTO "PurchaseHistory" (user_id, program_id, purchase_date) VALUES ($1, $2, CURRENT_DATE) RETURNING *', [userId, programId]);

        // Send the response
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error buying exercise program', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});