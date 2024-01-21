const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Pool } = require('pg');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3306;
const db = require('./models');

// Database connection configuration
const pool = new Pool({
    user: 'your_database_user',
    host: 'your_database_host',
    database: 'your_database_name',
    password: 'your_database_password',
    port: 3306, // Default PostgreSQL port
});

// Middleware to parse JSON requests
app.use(express.json());

// Express session middleware (required for Passport)
app.use(session({ secret: 'your_session_secret', resave: false, saveUninitialized: false }));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));
app.use('/login', require('./routes/login'));
app.use('/orders', require('./routes/orders'));
app.use('/products', require('./routes/products'));
app.use('/registration', require('./routes/registration'));
app.use('/user', require('./routes/user'));

const PORT = process.env.PORT || 3306;

db.sequelize
.sync()
.then(() =>
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
);

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });