const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Pool } = require('pg');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'Your API Description',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./server.js'], // Point to the file that contains your route definitions
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve order history for the authenticated user
 *     tags: [Order]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful response with order history
 *         content:
 *           application/json:
 *             example:
 *               - order_id: 1
 *                 user_id: 123
 *                 cart_id: 456
 *                 payment_details: {}
 *                 order_date: '2023-01-01'
 *               - order_id: 2
 *                 user_id: 123
 *                 cart_id: 789
 *                 payment_details: {}
 *                 order_date: '2023-02-01'
 */

// Retrieve Order History for a User (GET)
app.get('/orders', async (req, res) => {
    try {
        // Retrieve order history for the authenticated user
        const { rows } = await pool.query('SELECT * FROM "Order" WHERE user_id = $1', [req.user.user_id]);

        // Send the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving order history', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Retrieve details of a specific order by ID for the authenticated user
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with order details
 *         content:
 *           application/json:
 *             example:
 *               order_id: 1
 *               user_id: 123
 *               cart_id: 456
 *               payment_details: {}
 *               order_date: '2023-01-01'
 *       404:
 *         description: Order not found
 */

// Retrieve Specific Order by ID (GET)
app.get('/orders/:orderId', async (req, res) => {
    try {
        // Extract order ID from request parameters
        const { orderId } = req.params;

        // Query the database to get a specific order by ID
        const { rows } = await pool.query('SELECT * FROM "Order" WHERE order_id = $1 AND user_id = $2', [orderId, req.user.user_id]);

        // Check if the order exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Send the response
        res.json(rows[0]);
    } catch (error) {
        console.error('Error retrieving order by ID', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Process the checkout for the shopping cart
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             paymentDetails: {}
 *     responses:
 *       201:
 *         description: Checkout successful, order created
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Cart is empty or not found
 */

// Checkout Endpoint (POST)
app.post('/cart/:cartId/checkout', async (req, res) => {
    try {
        // Extract cart ID from request parameters
        const { cartId } = req.params;

        // Validate the cart (check if it exists)
        const { rows: cartRows } = await pool.query('SELECT * FROM "Cart" WHERE cart_id = $1', [cartId]);

        // Check if the cart exists
        if (cartRows.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // TODO: Validate payment details (for now, assume all payments succeed)

        // Simulate payment processing (replace with actual payment gateway integration in the future)
        // For now, just log the payment details
        const paymentDetails = req.body.paymentDetails;
        console.log('Simulating payment processing for cart:', cartId);
        console.log('Payment Details:', paymentDetails);

        // Create an order to reflect the successful payment
        const { rows: orderRows } = await pool.query('INSERT INTO "Order" (user_id, cart_id, payment_details, order_date) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *', [req.user.user_id, cartId, paymentDetails]);

        // Clear the cart (assuming a cart can only be used for one order)
        await pool.query('DELETE FROM "Cart" WHERE cart_id = $1', [cartId]);

        // Send the response
        res.status(201).json(orderRows[0]);
    } catch (error) {
        console.error('Error processing checkout', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the shopping cart of the authenticated user
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful response with the shopping cart
 *         content:
 *           application/json:
 *             example:
 *               cart_id: 1
 *               user_id: 123
 *               products: [
 *                 {
 *                   product_id: 1,
 *                   name: Strength programme,
 *                   category: Strength,
 *                   price: 19.99,
 *                   quantity: 2
 *                 },
 *                 {
 *                   product_id: 2,
 *                   name: Cardio programme,
 *                   category: Cardio,
 *                   price: 14.99,
 *                   quantity: 1
 *                 }
 *               ]
 */

// Create a New Cart (POST)
app.post('/cart', async (req, res) => {
    try {
        // Extract user ID from the session (assuming the user is authenticated)
        const userId = req.user ? req.user.user_id : null;

        // Insert a new cart for the user in the database
        const result = await pool.query('INSERT INTO "Cart" (user_id) VALUES ($1) RETURNING *', [userId]);

        // Send the response
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating a new cart', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the shopping cart
 *     tags: [Cart]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             product_id: 3
 *             quantity: 1
 *     responses:
 *       201:
 *         description: Product successfully added to the cart
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Product not found
 */

// Add Product to Cart (POST)
app.post('/cart/:cartId', async (req, res) => {
    try {
        // Extract cart ID from request parameters
        const { cartId } = req.params;

        // Extract product ID and quantity from the request body
        const { productId, quantity } = req.body;

        // TODO: Add validation for required fields and format

        // Insert the product into the cart in the database
        const result = await pool.query('INSERT INTO "CartProduct" (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [cartId, productId, quantity]);

        // Send the response
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding product to cart', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Cart Contents by Cart ID (GET)
app.get('/cart/:cartId', async (req, res) => {
    try {
        // Extract cart ID from request parameters
        const { cartId } = req.params;

        // Query the database to get the contents of the cart
        const { rows } = await pool.query('SELECT * FROM "CartProduct" WHERE cart_id = $1', [cartId]);

        // Send the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving cart contents', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints related to user authentication
 *   - name: User
 *     description: Endpoints related to user information
 *   - name: Product
 *     description: Endpoints related to products
 *   - name: Cart
 *     description: Endpoints related to shopping cart
 *   - name: Order
 *     description: Endpoints related to orders
 */

// Retrieve All Users (GET)
app.get('/users', async (req, res) => {
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

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the details of the authenticated user
 *     tags: [User]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Successful response with user details
 *         content:
 *           application/json:
 *             example:
 *               user_id: 123
 *               username: example_user
 */

// Retrieve Single User by ID (GET)
app.get('/users/:userId', async (req, res) => {
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
app.put('/users/:userId', async (req, res) => {
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

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successful response with a list of products
 *         content:
 *           application/json:
 *             example:
 *               - product_id: 1
 *                 name: Strength programme
 *                 category: Strength
 *                 description: A strength training program
 *                 price: 19.99
 *               - product_id: 2
 *                 name: Cardio programme
 *                 category: Cardio
 *                 description: A cardio workout program
 *                 price: 14.99
 *               - product_id: 3
 *                 name: Hypertrophy programme
 *                 category: Hypertrophy
 *                 description: A hypertrophy training program
 *                 price: 24.99
 */

// Retrieve Products by Category (GET)
app.get('/products', async (req, res) => {
    try {
        // Extract category ID from query parameters
        const categoryId = req.query.category;

        // Query the database to get products by category
        const { rows } = await pool.query('SELECT * FROM "Product" WHERE category_id = $1', [categoryId]);

        // Send the response
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving products by category', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get details of a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with product details
 *         content:
 *           application/json:
 *             example:
 *               product_id: 1
 *               name: Strength programme
 *               category: Strength
 *               description: A strength training program
 *               price: 19.99
 *       404:
 *         description: Product not found
 */v

// Retrieve Single Product by ID (GET)
app.get('/products/:productId', async (req, res) => {
    try {
        // Extract product ID from request parameters
        const { productId } = req.params;

        // Query the database to get a single product by ID
        const { rows } = await pool.query('SELECT * FROM "Product" WHERE product_id = $1', [productId]);

        // Check if the product exists
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Send the response
        res.json(rows[0]);
    } catch (error) {
        console.error('Error retrieving product by ID', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in with a username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: example_user
 *             password: example_password
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             example:
 *               user_id: 123
 *               username: example_user
 *       401:
 *         description: Authentication failed
 */

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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: example_user
 *             password: example_password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid request body
 *       409:
 *         description: User already exists
 */

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