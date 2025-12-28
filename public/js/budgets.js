document.addEventListener('DOMContentLoaded', () => {
    const budgetForm = document.getElementById('budgetForm');
    const budgetMonth = document.getElementById('budgetMonth');
    const categorySelect = document.getElementById('categorySelect');
    const budgetList = document.getElementById('budgetList');

    // Init
    const today = new Date();
    budgetMonth.value = today.toISOString().slice(0, 7); // YYYY-MM
    loadCategories();
    loadBudgets();

    budgetMonth.addEventListener('change', loadBudgets);

    budgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            category: budgetForm.category.value,
            amount_limit: budgetForm.amount_limit.value,
            month: budgetMonth.value
        };

        try {
            const res = await fetch('/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                budgetForm.reset();
                loadBudgets();
            } else {
                alert('Error setting budget');
            }
        } catch (err) { alert('Error setting budget'); }
    });

    async function loadCategories() {
        const res = await fetch('/categories');
        const cats = await res.json();
        categorySelect.innerHTML = cats.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    async function loadBudgets() {
        const month = budgetMonth.value;
        if (!month) return;

        const res = await fetch(`/budgets?month=${month}`);
        const budgets = await res.json();

        budgetList.innerHTML = budgets.map(b => {
            const progressColor = b.percent > 100 ? 'bg-red-500' :
                b.percent > 80 ? 'bg-yellow-500' : 'bg-green-500';

            return `
                <div class="card p-4">
                    <div class="flex justify-between items-center mb-2">
                        <div>
                            <h3 class="font-bold text-gray-900">${b.category}</h3>
                            <p class="text-xs text-gray-500">${month}</p>
                        </div>
                        <div class="text-right">
                             <span class="text-sm font-semibold text-gray-900">$${b.spent}</span>
                             <span class="text-xs text-gray-500"> / $${b.amount_limit}</span>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div class="${progressColor} h-2.5 rounded-full" style="width: ${Math.min(b.percent, 100)}%"></div>
                    </div>
                    <div class="flex justify-between mt-2 text-xs">
                        <span class="${b.remaining < 0 ? 'text-red-600 font-bold' : 'text-gray-500'}">
                            ${b.remaining < 0 ? `Over by $${Math.abs(b.remaining)}` : `$${b.remaining} left`}
                        </span>
                        <span>${b.percent}%</span>
                    </div>
                    <div class="mt-2 text-right">
                        <button onclick="deleteBudget(${b.id})" class="text-red-500 text-xs hover:underline">Remove Budget</button>
                    </div>
                </div>
             `;
        }).join('');
    }

    window.deleteBudget = async (id) => {
        if (!confirm('Remove this budget?')) return;
        await fetch(`/budgets/${id}`, { method: 'DELETE' });
        loadBudgets();
    };
});
