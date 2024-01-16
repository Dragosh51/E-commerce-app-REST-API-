const express = require('express');
const router = express.Router()

// Retrieve Products by Category (GET)
router.get('/products', async (req, res) => {
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

// Retrieve Single Product by ID (GET)
router.get('/products/:productId', async (req, res) => {
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

module.exports = router;