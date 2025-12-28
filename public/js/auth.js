document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLinks = document.querySelectorAll('.toggle-auth');
    const errorMsg = document.getElementById('errorMsg');

    // Toggle Login/Signup
    toggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            if (target === 'signup') {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                document.getElementById('formTitle').textContent = 'Create Account';
            } else {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('formTitle').textContent = 'Welcome Back';
            }
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';
        });
    });

    // Mock Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = '/dashboard.html';
        } else {
            showError('Invalid credentials (Try signing up first!)');
        }
    });

    // Mock Signup
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = signupForm.username.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm.confirmPassword.value;

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            showError('Username already exists');
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            password,
            currency: 'INR',
            theme: 'colorful'
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Initialize default categories for new user
        const defaultCategories = [
            { id: 1, name: 'Food' },
            { id: 2, name: 'Transport' },
            { id: 3, name: 'Entertainment' },
            { id: 4, name: 'Utilities' },
            { id: 5, name: 'Other' }
        ];
        localStorage.setItem(`categories_${newUser.id}`, JSON.stringify(defaultCategories));

        window.location.href = '/dashboard.html';
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }
});
