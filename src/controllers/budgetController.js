const db = require('../config/database');

exports.getBudgets = (req, res) => {
    const userId = req.session.userId;
    const { month } = req.query; // YYYY-MM

    if (!month) return res.status(400).json({ error: 'Month is required' });

    // Get Budgets
    const budgetSql = 'SELECT * FROM budgets WHERE user_id = ? AND month = ?';
    db.all(budgetSql, [userId, month], (err, budgets) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Calculate Spending per Category for the month
        const expenseSql = `
            SELECT category, SUM(amount) as total_spent 
            FROM expenses 
            WHERE user_id = ? AND date LIKE ? 
            GROUP BY category
        `;

        db.all(expenseSql, [userId, `${month}%`], (err, expenses) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            const spendingMap = {};
            expenses.forEach(e => spendingMap[e.category] = e.total_spent);

            const result = budgets.map(b => ({
                ...b,
                spent: spendingMap[b.category] || 0,
                remaining: b.amount_limit - (spendingMap[b.category] || 0),
                percent: Math.min(100, Math.round(((spendingMap[b.category] || 0) / b.amount_limit) * 100))
            }));

            res.json(result);
        });
    });
};

exports.setBudget = (req, res) => {
    const userId = req.session.userId;
    const { category, amount_limit, month } = req.body;

    if (!category || !amount_limit || !month) {
        return res.status(400).json({ error: 'Category, amount, and month are required' });
    }

    // Upsert Logic (Check if exists, then update or insert)
    const checkSql = 'SELECT id FROM budgets WHERE user_id = ? AND category = ? AND month = ?';
    db.get(checkSql, [userId, category, month], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (row) {
            const updateSql = 'UPDATE budgets SET amount_limit = ? WHERE id = ?';
            db.run(updateSql, [amount_limit, row.id], (err) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ message: 'Budget updated' });
            });
        } else {
            const insertSql = 'INSERT INTO budgets (user_id, category, amount_limit, month) VALUES (?, ?, ?, ?)';
            db.run(insertSql, [userId, category, amount_limit, month], function (err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ id: this.lastID, message: 'Budget set' });
            });
        }
    });
};

exports.deleteBudget = (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const sql = 'DELETE FROM budgets WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Budget deleted' });
    });
};
