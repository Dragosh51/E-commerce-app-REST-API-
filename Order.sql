CREATE TABLE "Order" (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id),
    cart_id INTEGER REFERENCES "Cart"(cart_id),
    payment_details JSONB, -- Assuming payment details are stored as JSON for simplicity
    order_date DATE
);