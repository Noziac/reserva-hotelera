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
    descripcion VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    precio_miembro DECIMAL(10,2) NOT NULL,
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

-- CREATE – Usuarios
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Jorge', 'jorge@email.com', '1234', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('María López', 'maria.lopez@email.com', '5678', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Carlos Soto', 'carlos.soto@email.com', 'abcd', 'administrador');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Ana Torres', 'ana.torres@email.com', 'pass1', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Luis Peña', 'luis.pena@email.com', 'pass2', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Sofía Rivas', 'sofia.rivas@email.com', 'pass3', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Diego Fuentes', 'diego.fuentes@email.com', 'pass4', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Valentina Díaz', 'valentina.diaz@email.com', 'pass5', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Tomás Herrera', 'tomas.herrera@email.com', 'pass6', 'cliente');
INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES ('Camila Vargas', 'camila.vargas@email.com', 'pass7', 'cliente');

-- CREATE – Habitaciones
INSERT INTO habitaciones (tipo, descripcion, precio, precio_miembro, disponible)
VALUES ('Tipo 1', 'Habitación con 2 camas normales', 109980, 90670, TRUE);
INSERT INTO habitaciones (tipo, descripcion, precio, precio_miembro, disponible)
VALUES ('Tipo 2', 'Habitación con 1 cama matrimonial', 135490, 112980, TRUE);
INSERT INTO habitaciones (tipo, descripcion, precio, precio_miembro, disponible)
VALUES ('Tipo 3', 'Habitación con 2 camas individuales y 1 cama matrimonial', 160450, 142220, TRUE);

-- CREATE – Reservas
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2025-09-10', '2025-09-15', 'confirmada', 1, 1);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2025-10-01', '2025-10-05', 'pendiente', 2, 2);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2025-11-20', '2025-11-25', 'confirmada', 3, 3);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2025-12-01', '2025-12-03', 'pendiente', 4, 1);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2025-12-10', '2025-12-15', 'confirmada', 5, 2);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-01-05', '2026-01-10', 'pendiente', 6, 3);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-01-15', '2026-01-20', 'confirmada', 7, 1);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-02-01', '2026-02-05', 'pendiente', 8, 2);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-02-10', '2026-02-15', 'confirmada', 9, 3);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-03-01', '2026-03-05', 'pendiente', 10, 1);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-03-10', '2026-03-15', 'confirmada', 1, 2);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-04-01', '2026-04-05', 'pendiente', 2, 3);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-04-10', '2026-04-15', 'confirmada', 3, 1);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-05-01', '2026-05-05', 'pendiente', 4, 2);
INSERT INTO reservas (fecha_inicio, fecha_fin, estado, usuario_id, habitacion_id) VALUES ('2026-05-10', '2026-05-15', 'confirmada', 5, 3);

-- READ
SELECT * FROM usuarios;
SELECT * FROM habitaciones;
SELECT * FROM reservas;

-- UPDATE
UPDATE reservas SET estado = 'cancelada' WHERE id = 2;
UPDATE reservas SET estado = 'cancelada' WHERE id = 5;
UPDATE reservas SET estado = 'cancelada' WHERE id = 8;
UPDATE reservas SET estado = 'cancelada' WHERE id = 11;
UPDATE reservas SET estado = 'cancelada' WHERE id = 14;

-- DELETE
DELETE FROM reservas WHERE id = 3;
DELETE FROM reservas WHERE id = 6;
DELETE FROM reservas WHERE id = 9;
DELETE FROM reservas WHERE id = 12;
DELETE FROM reservas WHERE id = 15;