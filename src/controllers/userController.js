const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.getProfile = (req, res) => {
    const userId = req.session.userId;
    const sql = 'SELECT username, currency, theme, profile_pic FROM users WHERE id = ?';
    db.get(sql, [userId], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
};

exports.updateProfile = (req, res) => {
    const userId = req.session.userId;
    const { username, currency, theme } = req.body;

    // Allow updating username, currency, and theme
    const sql = 'UPDATE users SET username = ?, currency = ?, theme = ? WHERE id = ?';
    db.run(sql, [username, currency, theme, userId], (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Profile updated' });
    });
};
