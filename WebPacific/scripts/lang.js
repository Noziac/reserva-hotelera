const translations = {
    es: {
        inicio: "INICIO",
        shows: "SHOWS",
        club: "PACIFIC CLUB",
        reserva: "RESERVA",
        cuenta: "MI CUENTA",
        reservar: "RESERVAR",
        fechaIngreso: "FECHA INGRESO",
        fechaSalida: "FECHA SALIDA",
        adultos: "ADULTOS",
        niños: "NIÑOS",
        habitaciones: "HABITACIONES"
    },
    en: {
        inicio: "HOME",
        shows: "SHOWS",
        club: "PACIFIC CLUB",
        reserva: "BOOKING",
        cuenta: "MY ACCOUNT",
        reservar: "BOOK NOW",
        fechaIngreso: "CHECK-IN DATE",
        fechaSalida: "CHECK-OUT DATE",
        adultos: "ADULTS",
        niños: "CHILDREN",
        habitaciones: "ROOMS"
    }
    };

function setLanguage(lang) {
    document.getElementById('current-lang').textContent = lang === 'es' ? 'ES' : 'EN';

    document.querySelector('.nav-links a:nth-child(1)').textContent = translations[lang].inicio;
    document.querySelector('.nav-links a:nth-child(2)').textContent = translations[lang].shows;
    document.querySelector('.nav-links a:nth-child(3)').textContent = translations[lang].club;
    document.querySelector('.nav-links a:nth-child(4)').textContent = translations[lang].reserva;
    document.querySelector('.nav-links a:nth-child(5)').textContent = translations[lang].cuenta;

    document.querySelector('label[for="check-in-date"]').textContent = translations[lang].fechaIngreso;
    document.querySelector('label[for="check-out-date"]').textContent = translations[lang].fechaSalida;
    document.querySelector('label[for="adults"]').textContent = translations[lang].adultos;
    document.querySelector('label[for="children"]').textContent = translations[lang].niños;
    document.querySelector('label[for="rooms"]').textContent = translations[lang].habitaciones;
    document.querySelector('.reserve-button').textContent = translations[lang].reservar;
    }

    document.getElementById('lang-es').addEventListener('click', () => setLanguage('es'));
    document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));