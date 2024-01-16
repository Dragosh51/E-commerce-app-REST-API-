const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

// Passport local strategy for username/password authentication
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        // Query the database to find the user with the provided username
        const { rows } = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);

        // Check if the user exists
        if (rows.length === 0) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        // Verify the password using bcrypt
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        // User authentication successful
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user information into the session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user from the session
passport.deserializeUser(async (userId, done) => {
    try {
        // Query the database to find the user by ID
        const { rows } = await pool.query('SELECT * FROM "User" WHERE user_id = $1', [userId]);

        // Check if the user exists
        if (rows.length === 0) {
            return done(null, false);
        }

        // User found
        const user = rows[0];
        return done(null, user);
    } catch (error) {
        return done(error);
    }
});