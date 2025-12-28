document.addEventListener('DOMContentLoaded', () => {
    const incomesTableBody = document.getElementById('incomesTableBody');
    const emptyState = document.getElementById('emptyState');
    const incomeModal = document.getElementById('incomeModal');
    const incomeForm = document.getElementById('incomeForm');
    const modalTitle = document.getElementById('modalTitle');

    let incomes = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Init
    loadIncomes();

    // Event Listeners
    document.getElementById('addIncomeBtn').addEventListener('click', () => openModal());
    document.getElementById('closeModal').addEventListener('click', () => closeModal());

    incomeForm.addEventListener('submit', handleFormSubmit);

    // Sort listener
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', renderIncomes);

    incomeModal.addEventListener('click', (e) => {
        if (e.target === incomeModal) closeModal();
    });

    function loadIncomes() {
        const allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
        incomes = allIncomes.filter(i => i.userId === currentUser.id);
        renderIncomes();
    }

    function renderIncomes() {
        // Simple client-side sorting if select exists
        const sortMode = document.getElementById('sortSelect')?.value;
        let filtered = [...incomes];

        if (sortMode) {
            filtered.sort((a, b) => {
                if (sortMode === 'date_desc') return new Date(b.date) - new Date(a.date);
                if (sortMode === 'date_asc') return new Date(a.date) - new Date(b.date);
                if (sortMode === 'amount_desc') return b.amount - a.amount;
                if (sortMode === 'amount_asc') return a.amount - b.amount;
                return 0;
            });
        }

        if (filtered.length === 0) {
            incomesTableBody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        incomesTableBody.innerHTML = filtered.map(inc => `
            <tr class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">${inc.date}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${inc.source}
                    </span>
                </td>
                <td class="px-6 py-4 text-gray-900">${inc.note || '-'}</td>
                <td class="px-6 py-4 font-medium text-green-600">+₹${inc.amount}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="editIncome(${inc.id})" class="text-blue-600 hover:text-blue-900 mr-3 opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    <button onclick="deleteIncome(${inc.id})" class="text-red-600 hover:text-red-900 opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.editIncome = (id) => {
        const inc = incomes.find(i => i.id === id);
        if (!inc) return;
        openModal(inc);
    };

    window.deleteIncome = (id) => {
        if (!confirm('Are you sure you want to delete this income?')) return;

        const allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
        const updatedIncomes = allIncomes.filter(i => i.id !== id);
        localStorage.setItem('incomes', JSON.stringify(updatedIncomes));
        loadIncomes();
    };

    function openModal(editingIncome = null) {
        incomeModal.classList.remove('hidden');
        if (editingIncome) {
            modalTitle.textContent = 'Edit Income';
            incomeForm.id.value = editingIncome.id;
            incomeForm.amount.value = editingIncome.amount;
            incomeForm.source.value = editingIncome.source;
            incomeForm.date.value = editingIncome.date;
            incomeForm.note.value = editingIncome.note || '';
        } else {
            modalTitle.textContent = 'Add Income';
            incomeForm.reset();
            incomeForm.id.value = '';
            incomeForm.date.value = new Date().toISOString().split('T')[0];
        }
    }

    function closeModal() {
        incomeModal.classList.add('hidden');
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(incomeForm);
        const data = Object.fromEntries(formData.entries());
        data.amount = parseFloat(data.amount);

        let allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');

        if (data.id) {
            // Update
            const id = parseInt(data.id);
            const index = allIncomes.findIndex(i => i.id === id);
            if (index !== -1) {
                allIncomes[index] = { ...allIncomes[index], ...data, id: id, userId: currentUser.id };
            }
        } else {
            // Create
            const newIncome = {
                ...data,
                id: Date.now(),
                userId: currentUser.id
            };
            allIncomes.push(newIncome);
        }

        localStorage.setItem('incomes', JSON.stringify(allIncomes));
        closeModal();
        loadIncomes();
    }
});
