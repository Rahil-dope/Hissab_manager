document.addEventListener('DOMContentLoaded', () => {
    // Mock Session Check
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAuthPage = window.location.pathname === '/' || window.location.pathname === '/index.html';

    if (!currentUser && !isAuthPage) {
        window.location.href = '/';
    } else if (currentUser && isAuthPage) {
        window.location.href = '/dashboard.html';
    }

    if (currentUser) {
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) userDisplay.textContent = currentUser.username;
        applyTheme(currentUser.theme || 'colorful');
    }

    // Sidebar Toggle (Mobile)
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (menuBtn && sidebar && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }

    // Mock Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = '/';
        });
    }

    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    function applyTheme(theme) {
        const body = document.body;
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
