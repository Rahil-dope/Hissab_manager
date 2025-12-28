document.addEventListener('DOMContentLoaded', () => {
    const nameDisplay = document.getElementById('profileName');
    const form = document.getElementById('settingsForm');
    const body = document.getElementById('bodyTheme');

    loadProfile();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            username: form.username.value,
            currency: form.currency.value,
            theme: form.theme.value
        };

        // Update Current User
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser = { ...currentUser, ...data };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update User in Users Array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Settings saved');
        loadProfile(); // Apply changes
    });

    function loadProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        nameDisplay.textContent = currentUser.username;
        if (form.username) form.username.value = currentUser.username;
        if (currentUser.currency) form.currency.value = currentUser.currency;
        if (currentUser.theme) {
            form.theme.value = currentUser.theme;
            applyTheme(currentUser.theme);
        }
    }

    function applyTheme(theme) {
        // Reset classes
        body.classList.remove('bg-gradient-to-br', 'from-indigo-50', 'via-white', 'to-purple-50');
        body.classList.remove('bg-gray-50');
        body.classList.remove('bg-gray-900', 'text-white');
        document.documentElement.classList.remove('dark');

        if (theme === 'colorful') {
            body.classList.add('bg-gradient-to-br', 'from-indigo-50', 'via-white', 'to-purple-50');
            body.classList.remove('text-white');
        } else if (theme === 'light') {
            body.classList.add('bg-gray-50');
            body.classList.remove('text-white');
        } else if (theme === 'dark') {
            body.classList.add('bg-gray-900', 'text-white');
            document.documentElement.classList.add('dark');
        }
    }
});
