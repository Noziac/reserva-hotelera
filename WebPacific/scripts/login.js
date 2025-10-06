document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');

    if (!form) {
    console.warn('Formulario de login no encontrado.');
    return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuario = form.usuario.value.trim();
        const contraseña = form.contraseña.value.trim();

        if (!usuario || !contraseña) {
            alert('Completa todos los campos.');
            return;
        }

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contraseña })
        })
        .then(res => res.json())
        .then(data => {
        if (data.success && data.perfil) {
            localStorage.setItem('usuario', data.perfil.usuario);
            localStorage.setItem('perfilUsuario', JSON.stringify(data.perfil));
            window.location.href = '/';
        } else {
            alert(data.message || 'Credenciales incorrectas.');
        }
        })
        .catch(err => {
        console.error('Error en login:', err);
        alert('Error de conexión.');
        });
    });
});