CREATE TABLE Cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id)
);

CREATE TABLE CartProduct (
    cart_product_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES Cart(cart_id),
    product_id INTEGER REFERENCES Product(product_id),
    quantity INTEGER NOT NULL
);