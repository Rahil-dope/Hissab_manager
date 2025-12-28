document.addEventListener('DOMContentLoaded', () => {
    const budgetList = document.getElementById('budgetList');
    const budgetForm = document.getElementById('budgetForm');
    const categorySelect = document.getElementById('categorySelect');
    const totalBudgetDisplay = document.getElementById('totalBudget');

    let budgets = [];
    let categories = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Init
    loadCategories();
    loadBudgets();

    budgetForm.addEventListener('submit', handleFormSubmit);

    function loadCategories() {
        const storedCategories = localStorage.getItem(`categories_${currentUser.id}`);
        categories = storedCategories ? JSON.parse(storedCategories) : [];
        if (categories.length === 0) {
            categories = [{ id: 1, name: 'Food' }, { id: 2, name: 'Transport' }];
        }

        categorySelect.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    function loadBudgets() {
        const allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
        // Filter by user and current month (simplified for demo to just show all relevant to user)
        budgets = allBudgets.filter(b => b.userId === currentUser.id);

        // Calculate totals
        const total = budgets.reduce((sum, b) => sum + parseFloat(b.amount_limit), 0);
        if (totalBudgetDisplay) totalBudgetDisplay.textContent = `Total Monthly Budget: ₹${total}`;

        renderBudgets();
    }

    function renderBudgets() {
        if (budgets.length === 0) {
            budgetList.innerHTML = '<p class="text-gray-500 text-center col-span-full">No budgets set yet.</p>';
            return;
        }

        budgetList.innerHTML = budgets.map(b => `
            <div class="card p-6 flex flex-col justify-between group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="deleteBudget(${b.id})" class="text-red-400 hover:text-red-600 p-1"><i data-feather="trash-2" class="w-4 h-4"></i></button>
                </div>
                <div>
                     <div class="flex items-center justify-between mb-2">
                        <h3 class="font-bold text-lg text-gray-800">${b.category}</h3>
                        <span class="text-sm font-semibold text-primary-600 px-2 py-1 bg-primary-50 rounded-lg">₹${b.amount_limit}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                        <div class="bg-primary-500 h-2.5 rounded-full" style="width: 0%"></div>
                    </div>
                     <p class="text-xs text-gray-400">Spent: ₹0 / ₹${b.amount_limit}</p>
                </div>
            </div>
        `).join('');

        if (typeof feather !== 'undefined') feather.replace();
    }

    window.deleteBudget = (id) => {
        if (!confirm('Delete this budget?')) return;
        const allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
        const updatedBudgets = allBudgets.filter(b => b.id !== id);
        localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
        loadBudgets();
    };

    function handleFormSubmit(e) {
        e.preventDefault();
        const category = budgetForm.category.value;
        const amount_limit = parseFloat(budgetForm.amount_limit.value);
        const month = new Date().toISOString().slice(0, 7); // Current month

        let allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');

        // Check if exists for this month/category
        const existingIndex = allBudgets.findIndex(b => b.userId === currentUser.id && b.category === category && b.month === month);

        if (existingIndex !== -1) {
            // Update
            allBudgets[existingIndex].amount_limit = amount_limit;
            alert('Budget updated for ' + category);
        } else {
            // Create
            allBudgets.push({
                id: Date.now(),
                userId: currentUser.id,
                category,
                amount_limit,
                month
            });
            alert('Budget set for ' + category);
        }

        localStorage.setItem('budgets', JSON.stringify(allBudgets));
        budgetForm.reset();
        loadBudgets();
    }
});
