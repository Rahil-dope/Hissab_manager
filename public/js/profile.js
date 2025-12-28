document.addEventListener('DOMContentLoaded', () => {
    const nameDisplay = document.getElementById('profileName');
    const form = document.getElementById('settingsForm');
    const body = document.getElementById('bodyTheme');

    loadProfile();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            username: form.username.value,
            currency: form.currency.value,
            theme: form.theme.value
        };

        try {
            const res = await fetch('/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                alert('Settings saved');
                loadProfile(); // Reload to update displayed name and theme
            } else {
                alert('Failed to save settings');
            }
        } catch (err) { alert('Failed to save settings'); }
    });

    async function loadProfile() {
        try {
            const res = await fetch('/user/profile');
            const data = await res.json();

            nameDisplay.textContent = data.username;
            // Set form values
            if (form.username) form.username.value = data.username;
            if (data.currency) form.currency.value = data.currency;
            if (data.theme) {
                form.theme.value = data.theme;
                applyTheme(data.theme);
            }
        } catch (err) { }
    }

    function applyTheme(theme) {
        // Reset classes
        body.classList.remove('bg-gradient-to-br', 'from-indigo-50', 'via-white', 'to-purple-50');
        body.classList.remove('bg-gray-50');
        body.classList.remove('bg-gray-900', 'text-white');
        document.documentElement.classList.remove('dark');

        if (theme === 'colorful') {
            body.classList.add('bg-gradient-to-br', 'from-indigo-50', 'via-white', 'to-purple-50');
            // Ensure dark text
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
