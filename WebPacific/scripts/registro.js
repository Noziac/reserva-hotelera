document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-registro');

    if (!form) {
        console.warn('Formulario de registro no encontrado.');
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre_completo = form.nombre_completo.value.trim();
        const usuario = form.usuario.value.trim();
        const correo = form.correo.value.trim();
        const contraseña = form.contraseña.value.trim();
        const confirmar_contraseña = form.confirmar_contraseña.value.trim();
        const aceptaTerminos = document.getElementById('terms').checked;

        if (!nombre_completo || !usuario || !correo || !contraseña || !confirmar_contraseña) {
        alert('Completa todos los campos obligatorios.');
        return;
        }

        if (contraseña !== confirmar_contraseña) {
        alert('Las contraseñas no coinciden.');
        return;
        }

        if (!aceptaTerminos) {
        alert('Debes aceptar los términos y condiciones.');
        return;
        }

        // Enviar datos al backend
        fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre_completo,
            usuario,
            correo,
            contraseña
        })
        })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            // Guardar perfil en localStorage
            const perfil = {
            nombre: nombre_completo,
            usuario,
            correo
            };
            localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
            localStorage.setItem('usuario', usuario); // Para cuenta.js

            window.location.href = '/';
        } else {
            alert(data.message || 'Error al registrar.');
        }
        })
        .catch(err => {
        console.error('Error en registro:', err);
        alert('Error de conexión al registrar.');
        });
    });
});
