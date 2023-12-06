const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
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

// Express session middleware (required for Passport)
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for username/password authentication
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Query the database to find the user with the provided username
        const { rows } = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);

        // Check if the user exists
        if (rows.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        // Verify the password using bcrypt
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        // User authentication successful
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user information into the session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user from the session
passport.deserializeUser(async (userId, done) => {
    try {
        // Query the database to find the user by ID
        const { rows } = await pool.query('SELECT * FROM "User" WHERE user_id = $1', [userId]);

        // Check if the user exists
        if (rows.length === 0) {
            return done(null, false);
        }

        // User found
        const user = rows[0];
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});

// Login Endpoint (POST)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/api/users/success', // Redirect on successful login
    failureRedirect: '/api/users/failure', // Redirect on failed login
    failureFlash: true,
}));

// Example success and failure routes
app.get('/api/users/success', (req, res) => {
    res.json({ success: true, user: req.user });
});

app.get('/api/users/failure', (req, res) => {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
});

// Register New User (POST)
app.post('/register', async (req, res) => {
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