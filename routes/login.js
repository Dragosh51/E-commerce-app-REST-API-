const express = require('express');
const router = express.Router()
const passport = require('passport');

// Login Endpoint (POST)
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/api/users/success', // Redirect on successful login
//     failureRedirect: '/api/users/failure', // Redirect on failed login
//     failureFlash: true,
// }));

// Example success and failure routes
router.get('/api/users/success', (req, res) => {
    res.json({ success: true, user: req.user });
});

router.get('/api/users/failure', (req, res) => {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
});

module.exports = router;