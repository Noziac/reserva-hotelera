document.addEventListener('DOMContentLoaded', () => {
    const cuentaBtn = document.getElementById('cuenta-btn');
    const cuentaMenu = document.getElementById('cuenta-menu');
    const perfil = JSON.parse(localStorage.getItem('perfilUsuario'));
    const usuario = perfil?.usuario || localStorage.getItem('usuario');

    // Menú desplegable en el header
    if (cuentaBtn && cuentaMenu) {
        if (usuario) {
        cuentaBtn.textContent = usuario;
        cuentaMenu.innerHTML = `
            <a href="/perfil">Mi perfil</a>
            <a href="/" id="logout">Cerrar sesión</a>
        `;

        cuentaMenu.querySelector('#logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.href = '/login';
        });
        } else {
        cuentaMenu.innerHTML = `
            <a href="/login">Iniciar sesión</a>
            <a href="/registro">Registrarse</a>
        `;
        }

        cuentaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cuentaMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
        if (!cuentaBtn.contains(e.target) && !cuentaMenu.contains(e.target)) {
            cuentaMenu.classList.add('hidden');
        }
        });
    }

    // Si estamos en perfil.html
    if (window.location.pathname.includes('/perfil')) {
        if (!perfil) {
        alert('No se encontró el perfil. Redirigiendo al login...');
        window.location.href = '/login';
        return;
        }

        // Mostrar datos del perfil
        const inputs = document.querySelectorAll('.profile-section .profile-input');
        if (inputs.length >= 7) {
            inputs[0].value = perfil.nombre || '';
            inputs[1].value = perfil.usuario || '';
            inputs[2].value = perfil.correo || '';
            inputs[3].value = perfil.telefono || '';
            inputs[4].value = perfil.pais || '';
            inputs[5].value = perfil.ciudad || '';
            inputs[6].value = perfil.direccion || '';
        }

        // Mostrar reservas activas
        fetch('/api/reservas-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: perfil.usuario })
        })
        .then(res => res.json())
        .then(data => {
        if (!data.success || !Array.isArray(data.reservas)) return;

            const contenedor = document.querySelector('.reservations-section');
            contenedor.innerHTML = '<h2>Reservas Activas</h2>';

            data.reservas.forEach(r => {
                const div = document.createElement('div');
                div.className = 'reservation-info';
                div.innerHTML = `
                <div class="info-row"><label>Fecha comienzo:</label><span>${formatearFecha(r.fecha_inicio)}</span></div>
                <div class="info-row"><label>Fecha término:</label><span>${formatearFecha(r.fecha_fin)}</span></div>
                <div class="info-row"><label>Estado:</label><span>${r.estado}</span></div>
                <div class="info-row" id="line"><label>Habitación:</label><span>${r.numero_habitacion}</span></div>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(err => {
        console.error('Error al cargar reservas:', err);
        });

        function formatearFecha(fecha) {
        const f = new Date(fecha);
        return `${f.getDate().toString().padStart(2, '0')} / ${(f.getMonth()+1).toString().padStart(2, '0')} / ${f.getFullYear()}`;
        }

        // Navegación lateral
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = {
        perfil: [
            document.querySelector('.profile-section'),
            document.querySelector('.password-section'),
            document.querySelector('.reservations-section')
        ],
        pagos: [
            document.querySelector('.payment-methods-section'),
            document.querySelector('.tarjetas-guardadas-section')
        ]
        };

        menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            Object.values(sections).flat().forEach(sec => {
            if (sec) sec.style.display = 'none';
            });

            if (item.textContent.includes('Perfil')) {
                sections.perfil.forEach(sec => sec && (sec.style.display = 'block'));
            }

            if (item.textContent.includes('Métodos de pago')) {
                sections.pagos.forEach(sec => sec && (sec.style.display = 'block'));
                cargarTarjetasGuardadas();
            }

            if (item.classList.contains('logout')) {
                localStorage.clear();
                window.location.href = '/login';
            }
            });
        });

        sections.perfil.forEach(sec => sec && (sec.style.display = 'block'));
        cargarTarjetasGuardadas();

        // Mostrar tarjetas guardadas
        function cargarTarjetasGuardadas() {
        const contenedor = document.getElementById('lista-tarjetas');
        if (!contenedor) return;

        fetch('/api/tarjetas-usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: perfil.usuario })
        })
        .then(res => res.json())
        .then(data => {
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
            `;
            contenedor.appendChild(div);
            });
        })
        .catch(err => {
            console.error('Error al cargar tarjetas:', err);
            contenedor.innerHTML = '<p>Error al cargar tarjetas.</p>';
        });
        }
    }
});
