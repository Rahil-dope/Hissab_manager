const CACHE_NAME = 'expense-tracker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/expenses.html',
    '/categories.html',
    '/incomes.html',
    '/budgets.html',
    '/reports.html',
    '/profile.html',
    '/css/style.css',
    '/js/app.js',
    '/js/auth.js',
    '/js/dashboard.js',
    '/js/expenses.js',
    '/js/incomes.js',
    '/js/budgets.js',
    '/js/profile.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://unpkg.com/feather-icons',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    // Basic cache-first strategy for static assets, network-first for API
    if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
