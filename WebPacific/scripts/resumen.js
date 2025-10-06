document.addEventListener('DOMContentLoaded', () => {
    const perfil = JSON.parse(localStorage.getItem('perfilUsuario'));
    const reserva = JSON.parse(localStorage.getItem('datosReserva'));
    const pago = JSON.parse(localStorage.getItem('datosPago'));

    // Validación de datos esenciales
    if (!perfil || !reserva || !reserva.precio) {
        alert('Error: faltan datos para mostrar el resumen.');
        return;
    }

    // Mostrar datos del cliente
    document.getElementById('nombre-cliente').textContent = perfil.nombre || '—';
    document.getElementById('correo-cliente').textContent = perfil.correo || '—';

    // Mostrar datos de la reserva
    document.getElementById('fecha-ingreso').textContent = reserva.fechaIngreso || '—';
    document.getElementById('fecha-salida').textContent = reserva.fechaSalida || '—';
    document.getElementById('tipo-habitacion').textContent = reserva.habitacion || '—';

    // Calcular precios reales
    const precioBase = reserva.precio;
    const anticipo = Math.round(precioBase * 0.3);

    document.getElementById('precio-total').textContent = `$${precioBase.toLocaleString('es-CL')}`;
    document.getElementById('precio-anticipo').textContent = `$${anticipo.toLocaleString('es-CL')}`;

    // Botón confirmar
    document.querySelector('.confirmar-btn').addEventListener('click', () => {
      const numeroHabitacion = reserva.habitacion?.split(' ')[1]; 

      fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaIngreso: reserva.fechaIngreso,
          fechaSalida: reserva.fechaSalida,
          usuario: perfil.usuario,
          numeroHabitacion,
          pago: anticipo
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Guardar datos para QR
          localStorage.setItem('reservaConfirmadaId', data.id_reserva);
          localStorage.setItem('reservaConfirmadaDatos', JSON.stringify({
              fecha_inicio: reserva.fechaIngreso,
              fecha_fin: reserva.fechaSalida,
              numero_habitacion: numeroHabitacion,
              estado: 'confirmada'
          }));

          // Limpiar datos previos
          localStorage.removeItem('datosReserva');
          localStorage.removeItem('datosPago');

          // Redirigir
          window.location.href = '/qr';
        } else {
          alert(data.message || 'Error al confirmar la reserva.');
        }
      })
      .catch(err => {
        console.error('Error al confirmar reserva:', err);
        alert('Error de conexión con el servidor.');
      });
    });

    // Botón rechazar
    document.querySelector('.rechazar-btn').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
        localStorage.removeItem('datosReserva');
        localStorage.removeItem('datosPago');
        window.location.href = '/reserva';
      }
    });
});
