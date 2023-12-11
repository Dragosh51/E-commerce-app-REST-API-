CREATE TABLE "Cart" (
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(user_id),
);