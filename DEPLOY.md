# 🚀 Guía de Deploy — App-Coins-BackEnd

## Stack Tecnológico
- **Runtime:** Node.js v22
- **Framework:** NestJS v10
- **Base de datos:** PostgreSQL 15+
- **ORM:** TypeORM 0.3

---

## 📋 Requisitos del Servidor (VPS)

| Recurso | Mínimo | Recomendado |
|---|---|---|
| RAM | 512 MB | 1 GB |
| CPU | 1 vCPU | 2 vCPU |
| Almacenamiento | 5 GB | 20 GB |
| SO | Ubuntu 22.04 | Ubuntu 22.04 |
| Puertos | 80, 443, 3000 | 80, 443, 3000 |

---

## ⚙️ Instalación en el VPS

### 1. Instalar Node.js v22
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # Verificar: v22.x.x
```

### 2. Instalar PostgreSQL
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Crear base de datos
```bash
sudo -u postgres psql
```
```sql
CREATE USER bachillero_user WITH PASSWORD 'tu_password_seguro';
CREATE DATABASE bachillero_db OWNER bachillero_user;
GRANT ALL PRIVILEGES ON DATABASE bachillero_db TO bachillero_user;
\q
```

### 4. Clonar el repositorio
```bash
git clone https://github.com/UleamEPTI/App-Coins-BackEnd.git
cd App-Coins-BackEnd
npm install
```

### 5. Configurar variables de entorno
```bash
cp .env.example .env
nano .env
```

Contenido del `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=bachillero_user
DB_PASSWORD=tu_password_seguro
DB_NAME=bachillero_db
JWT_SECRET=bachillero_jwt_secret_super_seguro_2026
PORT=3000
NODE_ENV=production
```

### 6. Crear las tablas en la BD
```bash
sudo -u postgres psql -d bachillero_db
```

```sql
-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion VARCHAR,
  created_at TIMESTAMP DEFAULT now()
);
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('INSTITUCION'), ('DOCENTE'), ('ESTUDIANTE');

-- Instituciones
CREATE TABLE instituciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  codigo VARCHAR UNIQUE NOT NULL,
  dominio VARCHAR,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Usuarios
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rol_id UUID REFERENCES roles(id),
  nombres VARCHAR NOT NULL,
  apellidos VARCHAR NOT NULL,
  cedula VARCHAR UNIQUE,
  telefono VARCHAR,
  email VARCHAR UNIQUE,
  password_hash VARCHAR NOT NULL,
  foto_perfil VARCHAR,
  institucion_id UUID REFERENCES instituciones(id),
  curso_id UUID,
  materia VARCHAR,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Cursos
CREATE TABLE cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  paralelo VARCHAR,
  descripcion VARCHAR,
  activo BOOLEAN DEFAULT true,
  institucion_id UUID REFERENCES instituciones(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Estudiantes
CREATE TABLE estudiantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  curso_id UUID REFERENCES cursos(id),
  codigo_estudiante VARCHAR UNIQUE,
  puntos INTEGER DEFAULT 0,
  fecha_nacimiento DATE,
  direccion VARCHAR,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Premios
CREATE TABLE premios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  descripcion VARCHAR,
  imagen VARCHAR,
  costo_puntos INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tipos de botella
CREATE TABLE tipos_botella (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institucion_id UUID REFERENCES instituciones(id),
  tamano VARCHAR NOT NULL,
  puntos INTEGER NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- ENUMs
CREATE TYPE tipo_transaccion AS ENUM ('SUMA', 'RESTA', 'CANJE');
CREATE TYPE estado_canje AS ENUM ('PENDIENTE', 'ENTREGADO', 'CANCELADO');
CREATE TYPE accion_auditoria AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- Historial de puntos
CREATE TABLE historial_puntos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID REFERENCES estudiantes(id),
  tipo tipo_transaccion NOT NULL,
  puntos INTEGER NOT NULL,
  descripcion VARCHAR,
  created_at TIMESTAMP DEFAULT now()
);

-- Canjes
CREATE TABLE canjes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID REFERENCES estudiantes(id),
  premio_id UUID REFERENCES premios(id),
  puntos_gastados INTEGER NOT NULL,
  estado estado_canje DEFAULT 'PENDIENTE',
  created_at TIMESTAMP DEFAULT now()
);

-- Reciclajes
CREATE TABLE reciclajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estudiante_id UUID REFERENCES estudiantes(id),
  tipo_botella_id UUID REFERENCES tipos_botella(id),
  cantidad INTEGER DEFAULT 1,
  puntos_ganados INTEGER NOT NULL,
  registrado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Auditoría
CREATE TABLE auditoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabla VARCHAR NOT NULL,
  accion accion_auditoria NOT NULL,
  registro_id VARCHAR NOT NULL,
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  usuario_id UUID REFERENCES usuarios(id),
  usuario_email VARCHAR,
  ip VARCHAR,
  created_at TIMESTAMP DEFAULT now()
);

-- Solicitudes de cambio de contraseña
CREATE TABLE solicitudes_password (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitado_por UUID REFERENCES usuarios(id),
  usuario_objetivo UUID REFERENCES usuarios(id),
  estado VARCHAR DEFAULT 'PENDIENTE',
  mensaje VARCHAR,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Usuario ADMIN por defecto (contraseña: Admin2026)
INSERT INTO usuarios (rol_id, nombres, apellidos, email, password_hash, activo)
VALUES (
  (SELECT id FROM roles WHERE nombre = 'ADMIN'),
  'Admin', 'Sistema', 'admin@bachillero.gob.ec',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  true
);
```

> ⚠️ **La contraseña del admin es: `password`** — cámbiela inmediatamente después del primer login.

### 7. Compilar y correr
```bash
npm run build
npm run start:prod
```

### 8. Correr como servicio (PM2)
```bash
npm install -g pm2
pm2 start dist/main.js --name bachillero-backend
pm2 save
pm2 startup
```

---

## 🌐 URLs disponibles

| URL | Descripción |
|---|---|
| `http://servidor:3000/api` | API principal |
| `http://servidor:3000/api/docs` | Documentación Swagger |

---

## 🔐 Credenciales por defecto

| Campo | Valor |
|---|---|
| Email | `admin@bachillero.gob.ec` |
| Contraseña | `password` |

> ⚠️ Cambiar la contraseña después del primer login.

---

## 📦 Módulos disponibles

| Módulo | Endpoints |
|---|---|
| Auth | login, profile, refresh token |
| Usuarios | CRUD + roles |
| Instituciones | CRUD + dominio |
| Estudiantes | CRUD |
| Premios | CRUD + stock |
| Puntos | dar/quitar + historial |
| Canjes | canjear + estados |
| Reciclajes | registrar + estadísticas |
| Tipos Botella | configurar puntos |
| Estadísticas | ranking + stats |
| Reportes | PDF por institución/curso |
| Auditoría | logs de acciones |
| Backup | manual + automático (2am) |
| Solicitudes Password | flujo de cambio de contraseña |

---

## 🔒 Seguridad implementada

- ✅ JWT con expiración
- ✅ Refresh token
- ✅ Bcrypt para contraseñas
- ✅ Rate limiting (100 req/min)
- ✅ Helmet (headers HTTP)
- ✅ CORS configurado
- ✅ Roles y permisos por endpoint
- ✅ Auditoría de acciones

---

## 💾 Backup

El sistema genera backups automáticos cada día a las 2:00 AM en la carpeta `backups/`.

Para backup manual:
```
POST /api/backup/manual
Authorization: Bearer <token-admin>
```

---

## 📞 Soporte

Repositorio: https://github.com/UleamEPTI/App-Coins-BackEnd
