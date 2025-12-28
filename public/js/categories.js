document.addEventListener('DOMContentLoaded', () => {
    const categoriesList = document.getElementById('categoriesList');
    const categoryForm = document.getElementById('categoryForm');

    let categories = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Init
    loadCategories();

    categoryForm.addEventListener('submit', handleFormSubmit);

    function loadCategories() {
        const storedCategories = localStorage.getItem(`categories_${currentUser.id}`);
        categories = storedCategories ? JSON.parse(storedCategories) : [];
        if (categories.length === 0) {
            // Fallback default
            categories = [{ id: 1, name: 'Food' }, { id: 2, name: 'Transport' }, { id: 3, name: 'Entertainment' }];
        }
        renderCategories();
    }

    function renderCategories() {
        if (categories.length === 0) {
            categoriesList.innerHTML = '<p class="text-gray-500 text-center py-4">No categories found.</p>';
            return;
        }

        categoriesList.innerHTML = categories.map(cat => `
            <div class="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow group">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                        <i data-feather="tag" class="w-5 h-5"></i>
                    </div>
                    <span class="font-medium text-gray-900">${cat.name}</span>
                </div>
                <button onclick="deleteCategory(${cat.id})" class="text-gray-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i data-feather="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');

        if (typeof feather !== 'undefined') feather.replace();
    }

    window.deleteCategory = (id) => {
        if (!confirm('Delete this category?')) return;
        categories = categories.filter(c => c.id !== id);
        localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(categories));
        loadCategories();
    };

    function handleFormSubmit(e) {
        e.preventDefault();
        const name = categoryForm.name.value.trim();
        if (!name) return;

        if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('Category already exists');
            return;
        }

        const newCategory = {
            id: Date.now(),
            name: name
        };
        categories.push(newCategory);
        localStorage.setItem(`categories_${currentUser.id}`, JSON.stringify(categories));

        categoryForm.reset();
        loadCategories();
    }
});
