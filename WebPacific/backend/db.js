const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jorge198102539/',
    database: 'reservas_hotel'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;




connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
        console.error('Error en la consulta de prueba:', err);
        return;
    }
    console.log('Resultado de prueba:', results[0].resultado); // Debería mostrar 2
});
