document.addEventListener('DOMContentLoaded', () => {
const guardarTarjetaBtn = document.querySelector('.payment-methods-section .confirm-btn');
const inputsTarjeta = document.querySelectorAll('.payment-methods-section .profile-input');
const perfil = JSON.parse(localStorage.getItem('perfilUsuario'));
const usuario = perfil?.usuario;

if (guardarTarjetaBtn && inputsTarjeta.length >= 3 && usuario) {
    guardarTarjetaBtn.addEventListener('click', () => {
        const numero = inputsTarjeta[0].value.trim();
        const expiracion = inputsTarjeta[1].value.trim();
        const codigo = inputsTarjeta[2].value.trim();

        if (!numero || !expiracion || !codigo) {
            alert('Por favor completa todos los campos de la tarjeta.');
            return;
        }

        fetch('/api/guardar-tarjeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, numero, expiracion, codigo })
        })
        .then(res => res.json())
        .then(data => {
        if (data.success) {
            alert('Tarjeta guardada correctamente.');
            inputsTarjeta.forEach(i => i.value = '');
            cargarTarjetasGuardadas(); // recarga la lista
        } else {
            alert(data.message || 'Error al guardar la tarjeta.');
        }
        })
        .catch(err => {
        console.error('Error al guardar tarjeta:', err);
        alert('Error de conexión con el servidor.');
        });
    });
}

// Función para cargar tarjetas guardadas
function cargarTarjetasGuardadas() {
    console.log('Ejecutando cargarTarjetasGuardadas...');
    const contenedor = document.getElementById('lista-tarjetas');
    if (!contenedor || !usuario) return;

    fetch('/api/tarjetas-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario })
    })
    .then(res => res.json())
    .then(data => {
        console.log('Respuesta del backend:', data);
        contenedor.innerHTML = '';

        if (!data.success || !Array.isArray(data.tarjetas)) {
            contenedor.innerHTML = '<p>No hay tarjetas guardadas.</p>';
            return;
        }

        const tarjetasValidas = data.tarjetas.filter(t => t.numero && t.expiracion);

        if (tarjetasValidas.length === 0) {
            contenedor.innerHTML = '<p>No hay tarjetas registradas.</p>';
            return;
        }

        tarjetasValidas.forEach(t => {
        const div = document.createElement('div');
        div.className = 'tarjeta-item';
        div.innerHTML = `
            <p><strong>•••• ${t.numero.slice(-4)}</strong> — Expira ${t.expiracion}</p>
            <button class="eliminar-tarjeta-btn">Eliminar</button>
        `;

        div.querySelector('.eliminar-tarjeta-btn').addEventListener('click', () => {
            if (!confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) return;

            fetch('/api/eliminar-tarjeta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario })
            })
            .then(res => res.json())
            .then(data => {
            if (data.success) {
                alert('Tarjeta eliminada correctamente.');
                cargarTarjetasGuardadas(); // recarga lista
            } else {
                alert(data.message || 'Error al eliminar tarjeta.');
            }
            })
            .catch(err => {
            console.error('Error al eliminar tarjeta:', err);
            alert('Error de conexión.');
            });
        });

        contenedor.appendChild(div);
        });
    })
    .catch(err => {
        console.error('Error al cargar tarjetas:', err);
        contenedor.innerHTML = '<p>Error al cargar tarjetas.</p>';
    });
    }

    // Ejecutar al cargar perfil.html
    if (window.location.pathname.includes('/perfil')) {
        cargarTarjetasGuardadas();
    }
});
