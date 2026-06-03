document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
    const errorDisplay = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');

    errorDisplay.innerText = '';
    submitBtn.disabled = true;
    submitBtn.innerText = 'Verificando firma perimetral...';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput,
                password: passwordInput
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Fallo en la autenticación perimetral');
        }

        localStorage.setItem('auth_token_digital', data.token);

        window.location.href = '/dashboard.html';

    } catch (err) {
        errorDisplay.innerText = err.message;
        errorDisplay.style.color = '#ef4444';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Ingresar al Sistema';
    }
});
