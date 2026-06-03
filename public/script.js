const token = localStorage.getItem('auth_token_digital');
if (token) {
    window.location.href = '/dashboard.html';
} else {
    window.location.href = '/login.html';
}