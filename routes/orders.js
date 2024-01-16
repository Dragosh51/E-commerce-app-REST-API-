const express = require('express');
const router = express.Router()


// Retrieve Order History for a User (GET)
router.get('/orders', async (req, res) => {
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

// Retrieve Specific Order by ID (GET)
router.get('/orders/:orderId', async (req, res) => {
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

module.exports = router;