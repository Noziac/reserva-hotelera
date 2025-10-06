document.addEventListener('DOMContentLoaded', () => {
    const adultosSelect = document.getElementById('adults');
    const niñosSelect = document.getElementById('children');
    const habitacionesSelect = document.getElementById('rooms');

    function validarPersonasYHabitaciones() {
        const adultos = parseInt(adultosSelect.value);
        const niños = parseInt(niñosSelect.value);
        const total = adultos + niños;

        if (adultos < 1) {
            alert('Debe haber al menos 1 adulto para continuar.');
            habitacionesSelect.value = '1';
            habitacionesSelect.disabled = true;
            return;
        }

        if (total >= 5) {
            habitacionesSelect.value = '2';
            habitacionesSelect.disabled = true;
        } else {
            habitacionesSelect.disabled = false;
        }
    }

    adultosSelect.addEventListener('change', validarPersonasYHabitaciones);
    niñosSelect.addEventListener('change', validarPersonasYHabitaciones);  

    
    const boton = document.querySelector('.reserve-button');
    if (!boton) {
        console.warn('Botón RESERVAR no encontrado');
        return;
    }

    boton.addEventListener('click', () => {
        const fechaIngreso = document.getElementById('check-in-date').value;
        const fechaSalida = document.getElementById('check-out-date').value;
        const adultos = parseInt(document.getElementById('adults').value);
        const niños = parseInt(document.getElementById('children').value);
        const habitaciones = parseInt(document.getElementById('rooms').value);

        if (!fechaIngreso || !fechaSalida || isNaN(adultos) || isNaN(niños) || isNaN(habitaciones)) {
            alert('Por favor completa todos los campos antes de continuar.');
            return;
        }

        localStorage.setItem('reservaDatos', JSON.stringify({
        fechaIngreso, fechaSalida, adultos, niños, habitaciones
        }));

        window.location.href = '/reserva';
    });
});