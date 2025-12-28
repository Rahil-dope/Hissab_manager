document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});

async function fetchDashboardData() {
    try {
        const [expRes, incRes] = await Promise.all([
            fetch('/expenses'),
            fetch('/incomes')
        ]);

        const expenses = await expRes.json();
        const incomes = await incRes.json();

        updateStats(expenses, incomes);
        renderCharts(expenses, incomes);
    } catch (err) {
        console.error(err);
    }
}

function updateStats(expenses, incomes) {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = today.slice(0, 7);

    // Expenses
    const todayExp = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
    const monthExp = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.amount, 0);

    // Incomes
    const monthInc = incomes.filter(i => i.date.startsWith(currentMonth)).reduce((sum, i) => sum + i.amount, 0);

    // Balance
    const totalExp = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalInc = incomes.reduce((sum, i) => sum + i.amount, 0);
    const balance = totalInc - totalExp;

    document.getElementById('todayTotal').textContent = formatCurrency(todayExp);
    document.getElementById('monthTotal').textContent = formatCurrency(monthExp);
    document.getElementById('totalBalance').textContent = formatCurrency(balance);

    // Add logic to color balance red if negative
    const balEl = document.getElementById('totalBalance');
    if (balance < 0) balEl.classList.add('text-red-600');
    else balEl.classList.remove('text-red-600');
}

function renderCharts(expenses, incomes) {
    // Pie Chart (Expenses)
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryData = {};
    expenses.forEach(ex => {
        categoryData[ex.category] = (categoryData[ex.category] || 0) + ex.amount;
    });

    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: [
                    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Bar Chart - Monthly Summary (Last 6 Months)
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    const monthlyData = {};
    const months = [];

    // Generate last 6 months labels
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const yyyymm = d.toISOString().slice(0, 7);
        months.push(yyyymm);
        monthlyData[yyyymm] = 0;
    }

    expenses.forEach(ex => {
        const month = ex.date.slice(0, 7);
        if (monthlyData.hasOwnProperty(month)) {
            monthlyData[month] += ex.amount;
        }
    });

    new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: months.map(m => {
                const [y, mon] = m.split('-');
                const date = new Date(y, mon - 1);
                return date.toLocaleString('default', { month: 'short' });
            }),
            datasets: [{
                label: 'Expenses',
                data: Object.values(monthlyData),
                backgroundColor: '#3B82F6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
