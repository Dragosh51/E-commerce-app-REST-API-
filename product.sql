CREATE TABLE Product (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES Category(category_id)
);

-- Example Category Table
CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Insert Categories
INSERT INTO Category (name) VALUES ('Strength'), ('Cardio'), ('Hypertrophy');

-- Insert Products
INSERT INTO Product (name, category_id) VALUES
    ('Strength Programme', 1), -- 1 corresponds to the category ID for 'Strength'
    ('Cardio Programme', 2),    -- 2 corresponds to the category ID for 'Cardio'
    ('Hypertrophy Programme', 3); -- 3 corresponds to the category ID for 'Hypertrophy'