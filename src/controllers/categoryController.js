const db = require('../config/database');

exports.getAllCategories = (req, res) => {
    const userId = req.session.userId;
    const sql = 'SELECT * FROM categories WHERE user_id = ?';
    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
};

exports.addCategory = (req, res) => {
    const userId = req.session.userId;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const sql = 'INSERT INTO categories (user_id, name) VALUES (?, ?)';
    db.run(sql, [userId, name], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: this.lastID, name });
    });
};

exports.deleteCategory = (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const sql = 'DELETE FROM categories WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted' });
    });
};
