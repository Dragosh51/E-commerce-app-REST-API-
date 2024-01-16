const express = require('express');
const router = express.Router()

// Checkout Endpoint (POST)
router.post('/cart/:cartId/checkout', async (req, res) => {
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

module.exports = router;