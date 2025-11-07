# Koala Educativo - Backend API

API REST desarrollada con Node.js, TypeScript, Express y PostgreSQL para la plataforma educativa Koala Educativo.

## 🚀 Tecnologías

- **Node.js** 18+
- **TypeScript** 5.2+
- **Express.js** 4.18+
- **PostgreSQL** 15+
- **Prisma ORM** 5.6+
- **JWT** para autenticación
- **Docker** para contenedorización

## 📋 Prerrequisitos

- Node.js 18.0.0 o superior
- npm 9.0.0 o superior
- PostgreSQL 15+ (o Docker)
- Git

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ProEducativo-koala
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
copy .env.example .env
```

Editar el archivo `.env` con tus valores:

```env
# Database
DATABASE_URL="postgresql://koala_user:koala_password@localhost:5432/koala_educativo?schema=public"
POSTGRES_USER=koala_user
POSTGRES_PASSWORD=koala_password
POSTGRES_DB=koala_educativo

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Base de datos

#### Opción A: Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres adminer
```

#### Opción B: PostgreSQL local

Instalar PostgreSQL y crear la base de datos:

```sql
CREATE DATABASE koala_educativo;
CREATE USER koala_user WITH PASSWORD 'koala_password';
GRANT ALL PRIVILEGES ON DATABASE koala_educativo TO koala_user;
```

### 5. Migraciones y generación de Prisma

```bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# (Opcional) Poblar datos iniciales
npm run db:seed
```

## 🏃‍♂️ Ejecutar en desarrollo

```bash
# Desarrollo con hot reload
npm run dev

# Construir para producción
npm run build

# Ejecutar producción
npm start
```

## 🐳 Docker

### Ejecutar solo la base de datos

```bash
docker-compose up -d postgres adminer
```

### Ejecutar todo el stack

```bash
docker-compose up -d
```

### Acceder a herramientas

- **API**: http://localhost:3001
- **Adminer** (DB Admin): http://localhost:8080
- **Health Check**: http://localhost:3001/health

## 📚 Estructura del proyecto

```
backend/
├── src/
│   ├── config/          # Configuración de la app
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middlewares personalizados
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos y interfaces TypeScript
│   ├── utils/           # Utilidades y helpers
│   ├── scripts/         # Scripts de migración y seed
│   ├── server.ts        # Configuración del servidor Express
│   └── index.ts         # Punto de entrada de la aplicación
├── prisma/
│   └── schema.prisma    # Esquema de base de datos
├── .env.example         # Variables de entorno de ejemplo
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
└── Dockerfile.dev       # Docker para desarrollo
```

## 🛡️ Endpoints principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Perfil del usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Instituciones
- `GET /api/institutions` - Listar instituciones
- `POST /api/institutions` - Crear institución
- `GET /api/institutions/:id` - Obtener institución
- `PUT /api/institutions/:id` - Actualizar institución
- `DELETE /api/institutions/:id` - Eliminar institución

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario

### Aulas
- `GET /api/classrooms` - Listar aulas
- `POST /api/classrooms` - Crear aula
- `GET /api/classrooms/:id` - Obtener aula

### Juegos
- `GET /api/games` - Listar juegos
- `GET /api/games/:id` - Obtener juego

### Progreso
- `GET /api/progress` - Obtener progreso del usuario
- `POST /api/progress` - Registrar progreso

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Cobertura de tests
npm run test:coverage
```

## 📋 Scripts disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Construir para producción
npm start            # Ejecutar en producción
npm run db:migrate   # Ejecutar migraciones
npm run db:generate  # Generar cliente Prisma
npm run db:seed      # Poblar datos iniciales
npm run db:studio    # Abrir Prisma Studio
npm run lint         # Linter de código
npm run lint:fix     # Arreglar errores de linting
npm run format       # Formatear código con Prettier
npm test             # Ejecutar tests
```

## 🔧 Desarrollo

### Agregar nueva funcionalidad

1. Crear/actualizar modelos en `prisma/schema.prisma`
2. Ejecutar migraciones: `npm run db:migrate`
3. Crear tipos en `src/types/`
4. Implementar servicios en `src/services/`
5. Crear controladores en `src/controllers/`
6. Definir rutas en `src/routes/`
7. Agregar tests correspondientes

### Convenciones de código

- Usar TypeScript estricto
- Seguir patrones RESTful para APIs
- Implementar manejo de errores consistente
- Usar middleware para validación
- Documentar endpoints importantes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.