-- Elimina la base de datos si ya existe, para empezar de cero
DROP DATABASE IF EXISTS reservas_hotel;
-- Crear DB
CREATE DATABASE reservas_hotel;
USE reservas_hotel;

-- Elimina las tablas si existen (útil para pruebas)
-- Se eliminan en orden inverso para evitar problemas de dependencias (Foreign Keys)
DROP TABLE IF EXISTS tickets_qr CASCADE;
DROP TABLE IF EXISTS pagos CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS habitaciones CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS reportes CASCADE;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Tabla de habitaciones
CREATE TABLE habitaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

-- Tabla de reservas
CREATE TABLE reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    usuario_id INT NOT NULL,
    habitacion_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)
);

-- Tabla de pagos
CREATE TABLE pagos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL,
    reserva_id INT NOT NULL,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);

-- Tabla de tickets QR
CREATE TABLE tickets_qr (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(255) NOT NULL,
    reserva_id INT NOT NULL,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);

-- Tabla de reportes
CREATE TABLE reportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    periodo VARCHAR(50) NOT NULL,
    datos TEXT
);

-- Operaciones CRUD

-- CREATE
INSERT INTO usuarios (nombre, email, contraseña, rol)
VALUES ('Jorge', 'jorge@email.com', '1234', 'cliente');

INSERT INTO habitaciones (tipo, precio, disponible)
VALUES ('Suite', 120000, TRUE);

INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id)
VALUES ('2025-09-10', '2025-09-15', 'confirmada', 1, 1);

-- READ
SELECT * FROM usuarios;
SELECT * FROM habitaciones;
SELECT * FROM reservas;

-- UPDATE
UPDATE reservas SET estado = 'cancelada' WHERE id = 1;

-- DELETE
DELETE FROM reservas WHERE id = 1;