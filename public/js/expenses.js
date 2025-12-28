document.addEventListener('DOMContentLoaded', () => {
    const expensesTableBody = document.getElementById('expensesTableBody');
    const emptyState = document.getElementById('emptyState');
    const expenseModal = document.getElementById('expenseModal');
    const expenseForm = document.getElementById('expenseForm');
    const modalTitle = document.getElementById('modalTitle');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const modalCategorySelect = document.getElementById('modalCategorySelect');

    let expenses = [];
    let categories = [];

    // Init
    loadCategories();
    loadExpenses();

    // Event Listeners
    document.getElementById('addExpenseBtn').addEventListener('click', () => openModal());
    document.getElementById('closeModal').addEventListener('click', () => closeModal());

    expenseForm.addEventListener('submit', handleFormSubmit);
    searchInput.addEventListener('input', renderExpenses);
    categoryFilter.addEventListener('change', renderExpenses);
    dateFilter.addEventListener('change', renderExpenses);
    document.getElementById('sortSelect').addEventListener('change', renderExpenses);

    expenseModal.addEventListener('click', (e) => {
        if (e.target === expenseModal) closeModal();
    });

    async function loadCategories() {
        try {
            const res = await fetch('/categories');
            categories = await res.json();

            // Populate Filters and Modal
            const options = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
            categoryFilter.innerHTML = '<option value="">All Categories</option>' + options;
            modalCategorySelect.innerHTML = options;
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    }

    async function loadExpenses() {
        try {
            const res = await fetch('/expenses'); // Fetch all for client-side filtering (simple app)
            expenses = await res.json();
            renderExpenses();
        } catch (err) {
            console.error('Failed to load expenses', err);
        }
    }

    function renderExpenses() {
        const searchTerm = searchInput.value.toLowerCase();
        const catFilter = categoryFilter.value;
        const dFilter = dateFilter.value;
        const sortMode = document.getElementById('sortSelect').value;

        let filtered = expenses.filter(ex => {
            const matchesSearch = (ex.note || '').toLowerCase().includes(searchTerm) || ex.amount.toString().includes(searchTerm);
            const matchesCategory = !catFilter || ex.category === catFilter;
            const matchesDate = !dFilter || ex.date === dFilter;
            return matchesSearch && matchesCategory && matchesDate;
        });

        // Sorting
        filtered.sort((a, b) => {
            if (sortMode === 'date_desc') return new Date(b.date) - new Date(a.date);
            if (sortMode === 'date_asc') return new Date(a.date) - new Date(b.date);
            if (sortMode === 'amount_desc') return b.amount - a.amount;
            if (sortMode === 'amount_asc') return a.amount - b.amount;
            return 0;
        });

        if (filtered.length === 0) {
            expensesTableBody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        expensesTableBody.innerHTML = filtered.map(ex => `
            <tr class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">${ex.date}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        ${ex.category}
                    </span>
                </td>
                <td class="px-6 py-4 text-gray-900">${ex.note || '-'} ${ex.is_recurring ? '<span class="ml-2 text-xs text-blue-500">(Recurring)</span>' : ''}</td>
                <td class="px-6 py-4 font-medium text-gray-900">₹${ex.amount}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="editExpense('${ex.id}')" class="text-blue-600 hover:text-blue-900 mr-3 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    <button onclick="deleteExpense('${ex.id}')" class="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.editExpense = (id) => {
        const ex = expenses.find(e => e.id === id);
        if (!ex) return;
        openModal(ex);
    };

    window.deleteExpense = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            await fetch(`/expenses/${id}`, { method: 'DELETE' });
            loadExpenses();
        } catch (err) {
            alert('Failed to delete expense');
        }
    };

    function openModal(editingExpense = null) {
        expenseModal.classList.remove('hidden');
        if (editingExpense) {
            modalTitle.textContent = 'Edit Expense';
            expenseForm.id.value = editingExpense.id;
            expenseForm.amount.value = editingExpense.amount;
            expenseForm.category.value = editingExpense.category;
            expenseForm.date.value = editingExpense.date;
            expenseForm.note.value = editingExpense.note;
            expenseForm.is_recurring.checked = !!editingExpense.is_recurring;
        } else {
            modalTitle.textContent = 'Add Expense';
            expenseForm.reset();
            expenseForm.id.value = '';
            expenseForm.date.value = new Date().toISOString().split('T')[0];
        }
    }

    function closeModal() {
        expenseModal.classList.add('hidden');
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(expenseForm);
        const data = Object.fromEntries(formData.entries());
        data.is_recurring = expenseForm.is_recurring.checked;

        const id = data.id;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/expenses/${id}` : '/expenses';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                closeModal();
                loadExpenses();
            } else {
                alert('Failed to save expense');
            }
        } catch (err) {
            alert('Error saving expense');
        }
    }
});
