document.querySelector('.profile-section .confirm-btn').addEventListener('click', () => {
    const inputs = document.querySelectorAll('.profile-section .profile-input');

    const nombre = inputs[0].value.trim();
    const usuario = inputs[1].value.trim(); // solo lectura si no se puede cambiar
    const correo = inputs[2].value.trim();
    const telefono = inputs[3].value.trim();
    const pais = inputs[4].value.trim();
    const ciudad = inputs[5].value.trim();
    const direccion = inputs[6].value.trim();

    if (!nombre || !usuario || !correo || !telefono) {
        alert('Por favor completa los campos obligatorios.');
        return;
    }

    fetch('/api/actualizar-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, nombre, correo, telefono, pais, ciudad, direccion })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
        alert('Perfil actualizado correctamente.');

        // Actualizar localStorage
        const perfilActualizado = {
            ...JSON.parse(localStorage.getItem('perfilUsuario')),
            nombre, correo, telefono, pais, ciudad, direccion
        };
        localStorage.setItem('perfilUsuario', JSON.stringify(perfilActualizado));
        } else {
        alert(data.message || 'Error al actualizar perfil.');
        }
    })
    .catch(err => {
        console.error('Error al actualizar perfil:', err);
        alert('Error de conexión con el servidor.');
    });
});