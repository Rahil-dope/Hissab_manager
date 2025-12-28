const bcrypt = require('bcrypt');
const db = require('../config/database');

exports.signup = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Server error' });

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.run(sql, [username, hash], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }

            // Auto login after signup
            req.session.userId = this.lastID;
            req.session.username = username;

            const userId = this.lastID;
            const defaultCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Others'];
            const placeholders = defaultCategories.map(() => '(?, ?)').join(',');
            const values = [];
            defaultCategories.forEach(cat => {
                values.push(userId, cat);
            });

            const catSql = `INSERT INTO categories (user_id, name) VALUES ${placeholders}`;
            db.run(catSql, values, (err) => {
                if (err) console.error('Error adding default categories:', err);
                // Even if categories fail, user is created
                res.status(201).json({ message: 'User created successfully', userId: userId });
            });
        });
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            if (result) {
                req.session.userId = user.id;
                req.session.username = user.username;
                res.json({ message: 'Login successful', userId: user.id });
            } else {
                res.status(400).json({ error: 'Invalid username or password' });
            }
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid'); // default session cookie name
        res.json({ message: 'Logout successful' });
    });
};

exports.checkSession = (req, res) => {
    if (req.session.userId) {
        res.json({ isAuthenticated: true, username: req.session.username });
    } else {
        res.json({ isAuthenticated: false });
    }
};
