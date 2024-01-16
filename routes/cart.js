const express = require('express');
const router = express.Router()

// Create a New Cart (POST)
router.post('/cart', async (req, res) => {
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

// Add Product to Cart (POST)
router.post('/cart/:cartId', async (req, res) => {
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
router.get('/cart/:cartId', async (req, res) => {
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

module.exports = router;