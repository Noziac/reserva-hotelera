document.addEventListener('DOMContentLoaded', () => {
    const perfil = JSON.parse(localStorage.getItem('perfilUsuario'));

    // Mostrar datos del usuario registrados
    document.getElementById('nombre-completo').textContent = perfil?.nombre || '';
    document.getElementById('nombre-usuario').textContent = perfil?.usuario || '';
    document.getElementById('correo-usuario').textContent = perfil?.correo || '';

    // Precargar campos si ya fueron completados antes
    document.querySelector('input[name="pais"]').value = perfil?.pais || '';
    document.querySelector('input[name="ciudad"]').value = perfil?.ciudad || '';
    document.querySelector('input[name="direccion"]').value = perfil?.direccion || '';
    document.querySelector('input[name="telefono"]').value = perfil?.telefono || '';

    // Guardar datos al continuar
    document.querySelector('.continue-btn').addEventListener('click', () => {
        const pais = document.querySelector('input[name="pais"]').value.trim();
        const ciudad = document.querySelector('input[name="ciudad"]').value.trim();
        const direccion = document.querySelector('input[name="direccion"]').value.trim();
        const telefono = document.querySelector('input[name="telefono"]').value.trim();

        if (!pais || !ciudad || !direccion || !telefono) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Actualizar perfil
        const perfilActualizado = {
        ...perfil,
        pais,
        ciudad,
        direccion,
        telefono
        };
        localStorage.setItem('perfilUsuario', JSON.stringify(perfilActualizado));

        // Guardar datos de pago
        const pago = {
        tarjeta_numero: document.querySelector('input[name="tarjeta-numero"]').value.trim(),
        tarjeta_expiracion: document.querySelector('input[name="tarjeta-expiracion"]').value.trim(),
        tarjeta_codigo: document.querySelector('input[name="tarjeta-codigo"]').value.trim()
        };
        localStorage.setItem('datosPago', JSON.stringify(pago));

        // Redirigir a confirmación
        window.location.href = '/resumen';
    });
});