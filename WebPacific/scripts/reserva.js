window.addEventListener('DOMContentLoaded', () => {
    const datos = JSON.parse(localStorage.getItem('reservaDatos'));
    if (datos) {
        buscarHabitaciones(datos.fechaIngreso, datos.fechaSalida, datos.adultos, datos.niños, datos.habitaciones);
    }
    });

    function buscarHabitaciones(fechaIngreso, fechaSalida, adultos, niños, habitaciones) {
    fetch('http://localhost:3000/api/habitaciones-disponibles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fechaIngreso, fechaSalida, adultos, niños, habitaciones })
    })
        .then(res => res.json())
        .then(data => {
        const contenedor = document.getElementById('resultado-habitaciones');
        contenedor.innerHTML = '';

        if (data.success && Array.isArray(data.habitaciones) && data.habitaciones.length > 0) {
            data.habitaciones.forEach(h => {
            const card = document.createElement('div');
            card.className = 'habitacion-card';
            card.innerHTML = `
                <div class="room-card">
                <div class="room-image">
                    <img src="../images/habitaciones/${obtenerImagen(h.descripcion)}" alt="Habitación ${h.numero}">
                </div>
                <div class="room-info">
                    <h2>HABITACIÓN ${h.numero} - ${h.tipo.toUpperCase()}</h2>
                    <p class="ocupacion">Ocupación máxima: ${h.capacidad}</p>
                    <div class="room-layout">
                    <div class="details">
                        <h3>Detalles:</h3>
                        <ul><li>${h.descripcion}</li></ul>
                    </div>
                    <div class="price-section">
                        <h3>Precios:</h3>
                        <div class="price-rows">
                        <div class="price-row">
                            <span>Miembro Pacific</span>
                            <div class="price-tag">
                            <span class="exclusive">Tarifa exclusiva</span>
                            <span class="price">$${Math.round(h.precio_diario * 0.82).toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="price-row">
                            <span>Tarifa normal</span>
                            <span class="price">$${Math.round(h.precio_diario).toLocaleString()}</span>
                        </div>
                        </div>
                        <button class="select-button">SELECCIONAR</button>
                    </div>
                    </div>
                </div>
                </div>
            `;
            contenedor.appendChild(card);

            const botonSeleccionar = card.querySelector('.select-button');
            botonSeleccionar.addEventListener('click', () => {
                const numero = h.numero.toString();

                // Guardar selección
                localStorage.setItem('habitacionesElegidas', JSON.stringify([numero]));
                console.log('Habitación seleccionada:', numero);

                const datosReserva = {
                fechaIngreso,
                fechaSalida,
                habitacion: `Habitación ${h.numero} - ${h.tipo}`,
                descripcion: h.descripcion,
                precio: Math.round(h.precio_diario * 0.82)
                };

            localStorage.setItem('datosReserva', JSON.stringify(datosReserva));

                // Validar perfil
                const perfil = JSON.parse(localStorage.getItem('perfilUsuario'));
                const camposObligatorios = ['pais', 'ciudad', 'direccion', 'telefono'];
                const perfilIncompleto = !perfil || camposObligatorios.some(campo => !perfil[campo]);

                if (perfilIncompleto) {
                window.location.href = '/info';
                } else {
                window.location.href = '/resumen';
                }
            });
            });
        } else {
            contenedor.innerHTML = '<p>No hay habitaciones disponibles para ese rango.</p>';
        }
        })
        .catch(err => console.error('Error al buscar habitaciones:', err));
    }

    function obtenerImagen(descripcion) {
    const desc = descripcion.toLowerCase();
    if (desc.includes('2 camas estándar') && desc.includes('1 cama matrimonial')) return '3.png';
    if (desc.includes('2 camas individuales')) return '1.png';
    if (desc.includes('1 cama matrimonial')) return '2.png';
    return 'default.png';
    }
