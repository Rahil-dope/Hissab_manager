const db = require('../config/database');

exports.getAllExpenses = (req, res) => {
    const userId = req.session.userId;
    const { category, startDate, endDate, sort } = req.query; // Simple filters

    let sql = 'SELECT * FROM expenses WHERE user_id = ?';
    const params = [userId];

    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }
    if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
    }

    if (sort === 'amount_asc') sql += ' ORDER BY amount ASC';
    else if (sort === 'amount_desc') sql += ' ORDER BY amount DESC';
    else if (sort === 'date_asc') sql += ' ORDER BY date ASC';
    else sql += ' ORDER BY date DESC'; // Default

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
};

exports.addExpense = (req, res) => {
    const userId = req.session.userId;
    const { amount, category, date, note, is_recurring } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Amount, category, and date are required' });
    }

    const sql = 'INSERT INTO expenses (user_id, amount, category, date, note, is_recurring) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [userId, amount, category, date, note || '', is_recurring ? 1 : 0], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: this.lastID, message: 'Expense added' });
    });
};

exports.updateExpense = (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    const { amount, category, date, note, is_recurring } = req.body;

    const sql = 'UPDATE expenses SET amount = ?, category = ?, date = ?, note = ?, is_recurring = ? WHERE id = ? AND user_id = ?';
    db.run(sql, [amount, category, date, note, is_recurring ? 1 : 0, id, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense updated' });
    });
};

exports.deleteExpense = (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const sql = 'DELETE FROM expenses WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Expense not found' });
        res.json({ message: 'Expense deleted' });
    });
};
