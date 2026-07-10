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
APP_VERSION=1.0.0
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
INSERT INTO roles (nombre, descripcion) VALUES 
  ('ADMIN', 'Administrador del sistema'),
  ('INSTITUCION', 'Director o gestor de institución'),
  ('DOCENTE', 'Profesor o encargado'),
  ('ESTUDIANTE', 'Alumno del sistema');

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
  debe_cambiar_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Cursos (ahora es el cliente principal: acumula puntos directamente)
CREATE TABLE cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR NOT NULL,
  paralelo VARCHAR,
  descripcion VARCHAR,
  activo BOOLEAN DEFAULT true,
  institucion_id UUID REFERENCES instituciones(id),
  puntos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Estudiantes (LEGACY: ya no se usa como cliente activo desde Julio 2026.
-- El cliente ahora es Curso. Se mantiene la tabla por si se reactiva para
-- otra institución, pero el CRUD y las relaciones de negocio actuales no
-- la usan.)
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

-- Tipos de botella (catálogo GLOBAL, aplica igual para todas las instituciones)
CREATE TABLE tipos_botella (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  curso_id UUID REFERENCES cursos(id),
  tipo tipo_transaccion NOT NULL,
  puntos INTEGER NOT NULL,
  descripcion VARCHAR,
  created_at TIMESTAMP DEFAULT now()
);

-- Canjes (ahora el curso canjea, no el estudiante)
CREATE TABLE canjes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES cursos(id),
  premio_id UUID REFERENCES premios(id),
  puntos_gastados INTEGER NOT NULL,
  estado estado_canje DEFAULT 'PENDIENTE',
  created_at TIMESTAMP DEFAULT now()
);

-- Reciclajes (por curso, registrado en kilos; 1 kilo = 1 moneda temporal,
-- pendiente tabla de conversión oficial de Bachillero)
CREATE TABLE reciclajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curso_id UUID REFERENCES cursos(id),
  kilos INTEGER NOT NULL DEFAULT 0,
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

-- Índices de rendimiento (importante para carga alta)
CREATE INDEX IF NOT EXISTS idx_cursos_puntos ON cursos(puntos DESC);
CREATE INDEX IF NOT EXISTS idx_reciclajes_curso ON reciclajes(curso_id);
CREATE INDEX IF NOT EXISTS idx_reciclajes_created ON reciclajes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_historial_curso ON historial_puntos(curso_id);
CREATE INDEX IF NOT EXISTS idx_canjes_curso ON canjes(curso_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_cursos_institucion ON cursos(institucion_id);

-- Usuario ADMIN por defecto
INSERT INTO usuarios (rol_id, nombres, apellidos, email, password_hash, activo, debe_cambiar_password)
VALUES (
  (SELECT id FROM roles WHERE nombre = 'ADMIN'),
  'Admin', 'Sistema', 'admin@bachillero.gob.ec',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  true,
  true
); 
```

> ⚠️ **La contraseña del admin es: `password`** — el sistema obliga a cambiarla en el primer login.

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

## 🔄 Actualización del servidor (cuando hay cambios en el repo)

```bash
cd App-Coins-BackEnd
git pull origin main
npm install
npm run build
pm2 restart bachillero-backend
```

---

## 🌐 URLs disponibles

| URL | Descripción |
|---|---|
| `http://servidor:3000/api` | API principal |
| `http://servidor:3000/api/version` | Versión actual del backend |

> ⚠️ Swagger (`/api/docs`) está deshabilitado en producción por seguridad.

---

## 🔐 Credenciales por defecto

| Campo | Valor |
|---|---|
| Email | `admin@bachillero.gob.ec` |
| Contraseña | `password` |

> ⚠️ El sistema obliga a cambiar la contraseña en el primer login.

---

## 📦 Módulos disponibles

| Módulo | Endpoints principales |
|---|---|
| Auth | login, profile, refresh, cambiar-password |
| Version | versión actual del backend |
| Usuarios | CRUD + roles |
| Instituciones | CRUD + dominio |
| Cursos | CRUD por institución |
| Estudiantes | LEGACY, desactivado (Bachillero pidió eliminar gestión individual) |
| Premios | CRUD + stock |
| Puntos | dar/quitar + historial, por curso |
| Canjes | canjear + estados, por curso (registrado por docente) |
| Reciclajes | registrar en kilos + estadísticas, por curso |
| Tipos Botella | LEGACY, ya no se usa (reciclaje ahora es directo en kilos) |
| Estadísticas | ranking de cursos + stats por institución/curso |
| Reportes | PDF por institución/curso, con filtro opcional por periodo (semana/mes/año) |
| Auditoría | logs de todas las acciones |
| Backup | manual + automático (2am) |
| Solicitudes Password | flujo de cambio de contraseña INSTITUCION/ADMIN |

---

## 🔒 Seguridad implementada

- ✅ JWT con expiración + refresh token
- ✅ Cambio de contraseña obligatorio en primer login
- ✅ Bcrypt para contraseñas (salt rounds: 10)
- ✅ Rate limiting (100 req/min por IP)
- ✅ Helmet (headers de seguridad HTTP)
- ✅ CORS configurado
- ✅ Roles y permisos por endpoint
- ✅ Auditoría de todas las acciones críticas
- ✅ Transacciones atómicas en reciclajes y canjes
- ✅ Swagger deshabilitado en producción

---

## ⚡ Rendimiento

- ✅ Connection pooling (20 conexiones máx, 2 mínimo)
- ✅ Índices en columnas críticas
- ✅ Backup automático diario a las 2:00 AM

---

## 💾 Backup

El sistema genera backups automáticos cada día a las 2:00 AM en la carpeta `backups/`. Mantiene los últimos 10 backups.

```
POST /api/backup/manual        → Backup manual
GET  /api/backup/listar        → Listar backups disponibles
```

---

## 📞 Soporte

Repositorio: https://github.com/UleamEPTI/App-Coins-BackEnd

---

## 🔄 Migraciones aplicadas

### Julio 2026 — Tipos de botella pasan a ser catálogo global

Antes, `tipos_botella` tenía `institucion_id`, como si cada institución tuviera su propio set de tipos. En realidad el negocio funciona con **4 tipos fijos e iguales para todas las instituciones**, y el ADMIN/INSTITUCION solo ajusta los puntos de esos 4.

**Cambios:**
- Se eliminó la columna `institucion_id` de `tipos_botella` (ver `migracion-tipos-botella-global.sql` en la raíz del repo).
- `GET /api/tipos-botella` ahora es accesible para `ADMIN`, `INSTITUCION` y `DOCENTE` (antes solo `ADMIN`).
- Se eliminó el endpoint `GET /api/tipos-botella/institucion/:institucion_id` — ya no aplica, porque el catálogo es el mismo para todos. El frontend debe usar `GET /api/tipos-botella` directamente.
- `POST`/`PUT`/`DELETE` de tipos de botella se mantienen solo para `ADMIN` e `INSTITUCION`.

**Importante:** este cambio requiere correr el script SQL de migración en la base de datos **antes** de desplegar el código nuevo (o justo después, sin dejar mucho tiempo entre ambos), porque el código ya no espera la columna `institucion_id`.

### Julio 2026 — Estudiante reemplazado por Curso; botellas reemplazadas por kilos

Bachillero pidió simplificar el modelo: ya no se gestiona estudiante individual (300-400 registros por institución), ahora todo se maneja por curso (10-15 por institución). El docente registra los kilos reciclados por su curso, y es el curso (no el estudiante) el que acumula puntos y canjea premios.

**Cambios de negocio:**
- El cliente del sistema pasa de ser `Estudiante` a ser `Curso`.
- El reciclaje ya no se registra por tipo de botella, se registra directo en **kilos** (1 kilo = 1 moneda, valor temporal marcado con `TODO` en `reciclajes.service.ts` — pendiente la tabla de conversión oficial que Bachillero se comprometió a enviar).
- El ranking pasa de ser entre estudiantes a ser entre cursos dentro de una institución. Sigue visible para `ADMIN`, `INSTITUCION` y `DOCENTE`.
- El canje de premios ahora lo hace el docente en nombre del curso (antes lo hacía el estudiante).
- El perfil individual de estudiante (login con puntos/curso/totalBottles) queda **comentado**, no eliminado.

**Cambios técnicos:**
- `cursos` ganó la columna `puntos` (antes vivía en `estudiantes`).
- `reciclajes`, `historial_puntos` y `canjes` cambiaron su columna `estudiante_id` por `curso_id`.
- `reciclajes` cambió `tipo_botella_id` + `cantidad` por una sola columna `kilos`.
- El módulo `estudiantes` (controller, rutas CRUD) quedó **comentado, no eliminado** — igual que `tipos-botella`, que ya no se usa porque el reciclaje es directo en kilos.
- Los datos viejos (estudiantes, reciclajes, historial y canjes previos a este cambio) NO se migraron a los cursos — se decidió que los cursos arrancan en 0 puntos. Los datos originales quedaron respaldados en tablas `*_backup_curso_migration` (ver `migracion-estudiante-a-curso.sql` en la raíz del repo), no se borraron.
- Nuevo: los reportes (`GET /api/reportes/institucion/:id` y `/curso/:id`) aceptan un query param opcional `?periodo=semana|mes|anio` para filtrar por rango de fecha.

**Endpoints que cambiaron para el frontend (avisar a quien mantiene el cliente):**
- `POST /api/reciclajes` ahora pide `{ curso_id, kilos }` (antes `{ estudiante_id, tipo_botella_id, cantidad }`).
- `POST /api/canjes` ahora pide `{ curso_id, premio_id }` (antes `{ estudiante_id, premio_id }`), y lo puede hacer el rol `DOCENTE` (antes lo hacía `ESTUDIANTE`).
- `GET /api/estadisticas/ranking/institucion/:institucion_id` ahora devuelve cursos, no estudiantes. Se eliminó `GET /api/estadisticas/ranking/curso/:curso_id` (ya no aplica: un curso no rankea contra sí mismo).
- `GET /api/puntos/historial/:curso_id` (antes `:estudiante_id`).
- `GET /api/reciclajes/curso/:curso_id`, `GET /api/canjes/curso/:curso_id` (antes `/estudiante/:estudiante_id`).
- Toda la sección `/api/estudiantes/*` deja de existir (404) hasta que se reactive.
- Toda la sección `/api/tipos-botella/*` deja de existir (404).

**Importante:** este cambio también requiere correr el script SQL `migracion-estudiante-a-curso.sql` en la base de datos antes de desplegar este código, en el mismo orden en que está el archivo (respaldo primero, luego cambios de estructura).