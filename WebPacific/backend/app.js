// Iniciando servidor
console.log('Iniciando servidor...');

const express = require('express');
const path = require('path');
const connection = require('./db');
const app = express();

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// LOGICA RESERVA
app.post('/api/reservas', (req, res) => {
    const { fechaIngreso, fechaSalida, usuario, numeroHabitacion, pago } = req.body;

    if (!fechaIngreso || !fechaSalida || !usuario || !numeroHabitacion || !pago) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    // Buscar usuario_id
    const sqlUsuario = 'SELECT id FROM usuarios WHERE usuario = ?';
    connection.query(sqlUsuario, [usuario], (err, userResults) => {
        if (err || userResults.length === 0) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ success: false, message: 'Usuario no encontrado.' });
        }

        const usuario_id = userResults[0].id;

        // Buscar habitacion_id
        const sqlHabitacion = 'SELECT id FROM habitaciones WHERE numero = ?';
        connection.query(sqlHabitacion, [numeroHabitacion], (err, habResults) => {
            if (err || habResults.length === 0) {
                console.error('Error al buscar habitación:', err);
                return res.status(500).json({ success: false, message: 'Habitación no encontrada.' });
            }

            const habitacion_id = habResults[0].id;

            // Insertar reserva
            const sqlReserva = `
                INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id, pago_reserva)
                VALUES (?, ?, 'confirmada', ?, ?, ?)
            `;
            const values = [fechaIngreso, fechaSalida, usuario_id, habitacion_id, pago];

            connection.query(sqlReserva, values, (err, results) => {
                if (err) {
                console.error('Error al guardar reserva:', err);
                return res.status(500).json({ success: false, message: 'Error al guardar reserva.' });
                }

                const reservaId = results.insertId;

                // Insertar pago
                const sqlPago = `
                    INSERT INTO pagos (monto, fecha, reserva_id)
                    VALUES (?, CURDATE(), ?)
                `;
                connection.query(sqlPago, [pago, reservaId], (err, pagoResult) => {
                    if (err) {
                        console.error('Error al guardar el pago:', err);
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Reserva confirmada y pago registrado.',
                        id_reserva: reservaId
                    });
                });
            });
        });
    });
});

// LÓGICA CONSULTA
app.post('/api/habitaciones-disponibles', (req, res) => {
    const { fechaIngreso, fechaSalida, adultos, niños, habitaciones } = req.body;
    const totalPersonas = adultos + niños;

    console.log('Datos recibidos en backend:', { fechaIngreso, fechaSalida, adultos, niños, habitaciones });

    const sql = `
        SELECT * FROM habitaciones
        WHERE id NOT IN (
        SELECT habitacion_id FROM reservas
        WHERE estado != 'cancelada'
        AND (fecha_inicio <= ? AND fecha_fin >= ?)
        )
    `;
    const values = [fechaSalida, fechaIngreso];

    function encontrarCombinaciones(habs, totalPersonas, habitacionesSolicitadas) {
        const combinaciones = [];

        function buscar(actual, inicio) {
        const capacidadTotal = actual.reduce((sum, h) => sum + h.capacidad, 0);

        if (actual.length <= habitacionesSolicitadas && capacidadTotal >= totalPersonas) {
            combinaciones.push([...actual]);
        }

        if (actual.length >= habitacionesSolicitadas) return;

        for (let i = inicio; i < habs.length; i++) {
            actual.push(habs[i]);
            buscar(actual, i + 1);
            actual.pop();
        }
        }

        buscar([], 0);
        return combinaciones;
    }

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error al buscar habitaciones:', err);
            return res.status(500).json({ success: false, message: 'Error interno' });
        }

        console.log('Habitaciones disponibles:', results);

        const combinacionesValidas = encontrarCombinaciones(results, totalPersonas, habitaciones);

        console.log('Combinaciones válidas:', combinacionesValidas);
        console.log('Respuesta enviada:', JSON.stringify(results, null, 2));

        if (combinacionesValidas.length > 0) {
            res.json({ success: true, habitaciones: combinacionesValidas.flat() });
        } else {
            console.log('Usando fallback: todas las habitaciones disponibles');
            res.json({ success: true, habitaciones: results });
        }
    });
});

// LOGICA REGISTRO
app.post('/api/registro', (req, res) => {
    const {
        nombre_completo,
        usuario,
        correo,
        contraseña,
        pais,
        ciudad,
        direccion,
        telefono,
        tarjeta_numero,
        tarjeta_expiracion,
        tarjeta_codigo
    } = req.body;

    if (!nombre_completo || !usuario || !correo || !contraseña) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
    }

    const sql = `
        INSERT INTO usuarios (
        nombre_completo, usuario, correo, contraseña,
        pais, ciudad, direccion, telefono,
        tarjeta_numero, tarjeta_expiracion, tarjeta_codigo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        nombre_completo, usuario, correo, contraseña,
        pais || null, ciudad || null, direccion || null, telefono || null,
        tarjeta_numero || null, tarjeta_expiracion || null, tarjeta_codigo || null
    ];

    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ success: false, message: 'Error interno al registrar.' });
        }

        res.status(201).json({ success: true, message: 'Usuario registrado correctamente.' });
    });
});

// LOGICA LOGIN
app.post('/api/login', (req, res) => {
    const { usuario, contraseña } = req.body;

    if (!usuario || !contraseña) {
        return res.status(400).json({ success: false, message: 'Faltan credenciales.' });
    }

    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?';
    connection.query(sql, [usuario, contraseña], (err, results) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).json({ success: false, message: 'Error interno.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        const user = results[0];
        const perfil = {
            nombre: user.nombre_completo,
            usuario: user.usuario,
            correo: user.correo,
            pais: user.pais,
            ciudad: user.ciudad,
            direccion: user.direccion,
            telefono: user.telefono
        };

        res.json({ success: true, perfil });
    });
});

// LOGICA RESERVAS PERFIL
app.post('/api/reservas-usuario', (req, res) => {
    const { usuario } = req.body;
    if (!usuario) return res.status(400).json({ success: false, message: 'Usuario requerido.' });

    const sql = `
        SELECT r.fecha_inicio, r.fecha_fin, r.estado, h.numero AS numero_habitacion
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.id
        JOIN habitaciones h ON r.habitacion_id = h.id
        WHERE u.usuario = ? AND r.estado = 'confirmada'
        ORDER BY r.fecha_inicio DESC
    `;

    connection.query(sql, [usuario], (err, results) => {
        if (err) {
            console.error('Error al consultar reservas:', err);
            return res.status(500).json({ success: false, message: 'Error interno.' });
        }

        res.json({ success: true, reservas: results });
    });
});

// LOGICA TARJETAS
app.post('/api/tarjetas-usuario', (req, res) => {
    const { usuario } = req.body;
    if (!usuario) return res.status(400).json({ success: false, message: 'Usuario requerido.' });

    const sql = `
        SELECT tarjeta_numero AS numero, tarjeta_expiracion AS expiracion
        FROM usuarios
        WHERE usuario = ?
    `;

    connection.query(sql, [usuario], (err, results) => {
        if (err) {
            console.error('Error al consultar tarjetas:', err);
            return res.status(500).json({ success: false, message: 'Error interno.' });
        }

        res.json({ success: true, tarjetas: results });
    });
});

// ACTUALIZAR PERFIL
app.post('/api/actualizar-perfil', (req, res) => {
    const {
        usuario,
        nombre,
        correo,
        telefono,
        pais,
        ciudad,
        direccion
    } = req.body;

    if (!usuario || !nombre || !correo || !telefono) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    const sql = `
        UPDATE usuarios
        SET nombre_completo = ?, correo = ?, telefono = ?, pais = ?, ciudad = ?, direccion = ?
        WHERE usuario = ?
    `;
    const values = [nombre, correo, telefono, pais || null, ciudad || null, direccion || null, usuario];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar perfil:', err);
            return res.status(500).json({ success: false, message: 'Error al actualizar perfil.' });
        }

        res.json({ success: true, message: 'Perfil actualizado correctamente.' });
    });
});

// TARJETAS
app.post('/api/guardar-tarjeta', (req, res) => {
    const { usuario, numero, expiracion, codigo } = req.body;

    if (!usuario || !numero || !expiracion || !codigo) {
        return res.status(400).json({ success: false, message: 'Faltan datos de la tarjeta.' });
    }

    const sql = `
        UPDATE usuarios
        SET tarjeta_numero = ?, tarjeta_expiracion = ?, tarjeta_codigo = ?
        WHERE usuario = ?
    `;
    const values = [numero, expiracion, codigo, usuario];

    connection.query(sql, values, (err, result) => {
    if (err) {
        console.error('Error al guardar tarjeta:', err);
        return res.status(500).json({ success: false, message: 'Error al guardar tarjeta.' });
    }

        res.json({ success: true, message: 'Tarjeta guardada correctamente.' });
    });
});

// ELIMINAR TARJETAS
app.post('/api/eliminar-tarjeta', (req, res) => {
    const { usuario } = req.body;

    if (!usuario) {
        return res.status(400).json({ success: false, message: 'Usuario no especificado.' });
    }

    const sql = `
        UPDATE usuarios
        SET tarjeta_numero = NULL, tarjeta_expiracion = NULL, tarjeta_codigo = NULL
        WHERE usuario = ?
    `;

    connection.query(sql, [usuario], (err, result) => {
    if (err) {
        console.error('Error al eliminar tarjeta:', err);
        return res.status(500).json({ success: false, message: 'Error al eliminar tarjeta.' });
    }

        res.json({ success: true, message: 'Tarjeta eliminada correctamente.' });
    });
});

// Rutas del backend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/index.html'));
});

app.get('/shows', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/shows.html'));
});

app.get('/club', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/club.html'));
});

app.get('/reserva', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/reserva.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/perfil.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/registro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/login.html'));
});

app.get('/info', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/informacion.html'));
});

app.get('/resumen', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/resumen.html'));
});

app.get('/qr', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/qr.html'));
});

app.use(express.static(path.join(__dirname, '..')));

// Iniciar servidor en puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

// Consulta de prueba
connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
        console.error('Error en la consulta de prueba:', err);
        return;
    }
    console.log('Resultado de prueba:', results[0].resultado);
});