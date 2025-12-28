document.addEventListener('DOMContentLoaded', () => {
    // Check Session (skip for login page)
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        fetch('/auth/me')
            .then(res => res.json())
            .then(data => {
                if (!data.isAuthenticated) {
                    window.location.href = '/';
                } else {
                    const userDisplay = document.getElementById('userDisplay');
                    if (userDisplay) userDisplay.textContent = data.username;
                }
            })
            .catch(() => window.location.href = '/');
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

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('/auth/logout', { method: 'POST' })
                .then(() => window.location.href = '/');
        });
    }

    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Failed', err));
    }
});
