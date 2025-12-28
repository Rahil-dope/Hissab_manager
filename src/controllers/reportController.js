
const db = require('../config/database');

exports.exportCsv = (req, res) => {
    const userId = req.session.userId;
    const type = req.query.type || 'expenses';
    const table = type === 'incomes' ? 'incomes' : 'expenses';

    const sql = `SELECT * FROM ${table} WHERE user_id = ? ORDER BY date DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).send('Database error');

        const isExpense = type !== 'incomes';
        let csv = isExpense ? 'Date,Category,Amount,Note,Recurring\n' : 'Date,Source,Amount,Note,Recurring\n';

        rows.forEach(row => {
            csv += `${row.date},${isExpense ? row.category : row.source},${row.amount}, "${row.note || ''}", ${row.is_recurring ? 'Yes' : 'No'} \n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment(`${table}.csv`);
        res.send(csv);
    });
};

exports.monthlyReport = (req, res) => {
    const userId = req.session.userId;
    const date = new Date();
    const currentMonth = date.toISOString().slice(0, 7); // YYYY-MM

    // Fetch both Expenses and Incomes for the month
    const expSql = 'SELECT * FROM expenses WHERE user_id = ? AND date LIKE ? ORDER BY date ASC';
    const incSql = 'SELECT * FROM incomes WHERE user_id = ? AND date LIKE ? ORDER BY date ASC';

    db.all(expSql, [userId, `${currentMonth}%`], (err, expenses) => {
        if (err) return res.status(500).send('Database error');

        db.all(incSql, [userId, `${currentMonth}%`], (err, incomes) => {
            if (err) return res.status(500).send('Database error');

            const totalExp = expenses.reduce((sum, r) => sum + r.amount, 0);
            const totalInc = incomes.reduce((sum, r) => sum + r.amount, 0);
            const savings = totalInc - totalExp;

            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Monthly Report - ${currentMonth}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .summary { display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; }
                        .section { margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Financial Report</h1>
                        <p>Month: ${currentMonth}</p>
                    </div>
                    
                    <div class="summary">
                        <span>Income: $${totalInc}</span>
                        <span>Expenses: $${totalExp}</span>
                        <span>Savings: $${savings}</span>
                    </div>

                    <div class="section">
                        <h2>Incomes</h2>
                         <table>
                            <thead><tr><th>Date</th><th>Source</th><th>Amount</th></tr></thead>
                            <tbody>
                                ${incomes.map(r => `<tr><td>${r.date}</td><td>${r.source}</td><td>${r.amount}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <h2>Expenses</h2>
                         <table>
                            <thead><tr><th>Date</th><th>Category</th><th>Amount</th></tr></thead>
                            <tbody>
                                ${expenses.map(r => `<tr><td>${r.date}</td><td>${r.category}</td><td>${r.amount}</td></tr>`).join('')}
                            </tbody>
                        </table>
                    </div>

                    <script>window.print();</script>
                </body>
                </html>
             `;
            res.send(html);
        });
    });
};

