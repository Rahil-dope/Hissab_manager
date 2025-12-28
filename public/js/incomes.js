document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('incomesTableBody');
    const modal = document.getElementById('incomeModal');
    const form = document.getElementById('incomeForm');
    const openBtn = document.getElementById('addIncomeBtn');
    const closeBtn = document.getElementById('closeModal');

    loadIncomes();

    openBtn.addEventListener('click', () => {
        form.reset();
        form.date.value = new Date().toISOString().split('T')[0];
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.is_recurring = form.is_recurring.checked;

        try {
            const res = await fetch('/incomes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                modal.classList.add('hidden');
                loadIncomes();
            } else {
                alert('Error adding income');
            }
        } catch (err) {
            console.error(err);
        }
    });

    async function loadIncomes() {
        const res = await fetch('/incomes');
        const incomes = await res.json();

        tableBody.innerHTML = incomes.map(inc => `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">${inc.date}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${inc.source}</td>
                <td class="px-6 py-4 text-gray-500">${inc.note || '-'} ${inc.is_recurring ? '<span class="text-blue-500 text-xs">(Recurring)</span>' : ''}</td>
                <td class="px-6 py-4 font-bold text-green-600">+$${inc.amount}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="deleteIncome(${inc.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    window.deleteIncome = async (id) => {
        if (!confirm('Area you sure?')) return;
        await fetch(`/incomes/${id}`, { method: 'DELETE' });
        loadIncomes();
    };
});
