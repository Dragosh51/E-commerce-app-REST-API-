CREATE TABLE User (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TABLE UserProfile (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES User(user_id) UNIQUE
);

CREATE TABLE PurchaseHistory (
    purchase_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES User(user_id),
    program_id INTEGER REFERENCES TrainingProgram(program_id),
    recipe_id INTEGER REFERENCES FoodRecipe(recipe_id),
    purchase_date DATE,
    FOREIGN KEY (program_id, recipe_id) REFERENCES TrainingProgram(program_id, recipe_id)
);