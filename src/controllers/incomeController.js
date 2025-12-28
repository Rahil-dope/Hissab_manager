const db = require('../config/database');

exports.getAllIncomes = (req, res) => {
    const userId = req.session.userId;
    const { startDate, endDate } = req.query;

    let sql = 'SELECT * FROM incomes WHERE user_id = ?';
    const params = [userId];

    if (startDate) {
        sql += ' AND date >= ?';
        params.push(startDate);
    }
    if (endDate) {
        sql += ' AND date <= ?';
        params.push(endDate);
    }

    sql += ' ORDER BY date DESC';

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
};

exports.addIncome = (req, res) => {
    const userId = req.session.userId;
    const { amount, source, date, note, is_recurring } = req.body;

    if (!amount || !source || !date) {
        return res.status(400).json({ error: 'Amount, source, and date are required' });
    }

    const sql = 'INSERT INTO incomes (user_id, amount, source, date, note, is_recurring) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [userId, amount, source, date, note || '', is_recurring ? 1 : 0], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: this.lastID, message: 'Income added' });
    });
};

exports.deleteIncome = (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const sql = 'DELETE FROM incomes WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ error: 'Income not found' });
        res.json({ message: 'Income deleted' });
    });
};
