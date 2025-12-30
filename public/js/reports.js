document.addEventListener('DOMContentLoaded', () => {
    // CSV Export Handlers
    const exportExpensesBtn = document.getElementById('exportExpensesBtn');
    const exportIncomesBtn = document.getElementById('exportIncomesBtn');
    const viewMonthlyReportBtn = document.getElementById('viewMonthlyReportBtn');

    if (exportExpensesBtn) {
        exportExpensesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportToCSV('expenses');
        });
    }

    if (exportIncomesBtn) {
        exportIncomesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            exportToCSV('incomes');
        });
    }

    if (viewMonthlyReportBtn) {
        viewMonthlyReportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            generateMonthlyReport();
        });
    }

    function exportToCSV(type) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return alert('Please login first');

        const key = type === 'expenses' ? 'expenses' : 'incomes';
        const data = JSON.parse(localStorage.getItem(key) || '[]').filter(item => item.userId === currentUser.id);

        if (data.length === 0) {
            return alert(`No ${type} data found to export.`);
        }

        // Define headers based on type
        const headers = type === 'expenses'
            ? ['Date', 'Category', 'Note', 'Amount']
            : ['Date', 'Source', 'Note', 'Amount'];

        const rows = data.map(item => {
            const note = (item.note || '').replace(/"/g, '""'); // Escape quotes
            if (type === 'expenses') {
                return `"${item.date}","${item.category}","${note}",${item.amount}`;
            } else {
                return `"${item.date}","${item.source}","${note}",${item.amount}`;
            }
        });

        const csvContent = [
            headers.join(','),
            ...rows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateMonthlyReport() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return alert('Please login first');

        const expenses = JSON.parse(localStorage.getItem('expenses') || '[]').filter(e => e.userId === currentUser.id);
        const incomes = JSON.parse(localStorage.getItem('incomes') || '[]').filter(i => i.userId === currentUser.id);

        // Filter for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyExpenses = expenses.filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const monthlyIncomes = incomes.filter(i => {
            const d = new Date(i.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const totalIncomes = monthlyIncomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
        const balance = totalIncomes - totalExpenses;

        const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Create Print Window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Monthly Report - ${monthName}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    h1 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
                    .summary { display: flex; gap: 20px; margin-bottom: 30px; }
                    .card { background: #f8fafc; padding: 20px; border-radius: 8px; flex: 1; border: 1px solid #e2e8f0; }
                    .card h3 { margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #64748b; }
                    .card p { margin: 0; font-size: 24px; font-weight: bold; }
                    .green { color: #16a34a; }
                    .red { color: #dc2626; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
                    th { background: #f1f5f9; font-weight: 600; color: #475569; }
                    .section-title { margin-top: 40px; font-size: 18px; font-weight: bold; color: #334155; }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Monthly Report: ${monthName}</h1>
                
                <div class="summary">
                    <div class="card">
                        <h3>Total Income</h3>
                        <p class="green">+₹${totalIncomes.toFixed(2)}</p>
                    </div>
                    <div class="card">
                        <h3>Total Expenses</h3>
                        <p class="red">-₹${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div class="card">
                        <h3>Net Balance</h3>
                        <p style="color: ${balance >= 0 ? '#16a34a' : '#dc2626'}">₹${balance.toFixed(2)}</p>
                    </div>
                </div>

                <div class="section-title">Income Breakdown</div>
                <table>
                    <thead>
                        <tr><th>Date</th><th>Source</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                        ${monthlyIncomes.length ? monthlyIncomes.map(i => `
                            <tr>
                                <td>${i.date}</td>
                                <td>${i.source}</td>
                                <td class="green">+₹${parseFloat(i.amount).toFixed(2)}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="3">No income this month</td></tr>'}
                    </tbody>
                </table>

                <div class="section-title">Expense Breakdown</div>
                <table>
                    <thead>
                        <tr><th>Date</th><th>Category</th><th>Note</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                        ${monthlyExpenses.length ? monthlyExpenses.map(e => `
                            <tr>
                                <td>${e.date}</td>
                                <td>${e.category}</td>
                                <td>${e.note || '-'}</td>
                                <td class="red">-₹${parseFloat(e.amount).toFixed(2)}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="4">No expenses this month</td></tr>'}
                    </tbody>
                </table>

                <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px;">
                    Generated by Student Expense Tracker on ${new Date().toLocaleDateString()}
                </div>
                <script>
                    window.onload = () => { setTimeout(() => window.print(), 500); };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
});
