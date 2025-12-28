document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLinks = document.querySelectorAll('.toggle-auth');
    const authContainer = document.getElementById('authContainer');
    const errorMsg = document.getElementById('errorMsg');

    // Toggle Login/Signup
    toggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target; // 'login' or 'signup'
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

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                window.location.href = '/dashboard.html';
            } else {
                showError(result.error);
            }
        } catch (err) {
            showError('An error occurred. Please try again.');
        }
    });

    // Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            const res = await fetch('/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: data.username, password: data.password })
            });
            const result = await res.json();

            if (res.ok) {
                window.location.href = '/dashboard.html';
            } else {
                showError(result.error);
            }
        } catch (err) {
            showError('An error occurred. Please try again.');
        }
    });

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }
});
