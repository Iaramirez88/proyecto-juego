# 🔧 Configuración de Puertos - Koala Educativo

## 📋 Mapa de Puertos del Sistema

| Servicio | Puerto | URL | Descripción |
|----------|--------|-----|-------------|
| **Frontend React** | 3000 | http://localhost:3000 | Aplicación web principal |
| **Backend API** | 3001 | http://localhost:3001 | API REST Node.js/Express |
| **PostgreSQL** | 5433 | localhost:5433 | Base de datos principal |
| **Adminer** | 8080 | http://localhost:8080 | Administrador de BD (Docker) |
| **Prisma Studio** | 5555 | http://localhost:5555 | GUI de Prisma (opcional) |

## 🚀 URLs Principales

### Desarrollo Local
- **Aplicación:** http://localhost:3000
- **API Health Check:** http://localhost:3001/health
- **API Base:** http://localhost:3001/api
- **Administrador BD:** http://localhost:8080

### Endpoints de la API
```
GET  /health                    # Estado del servidor
POST /api/auth/login           # Iniciar sesión
POST /api/auth/register        # Registrar usuario
GET  /api/auth/me              # Perfil del usuario
GET  /api/institutions         # Listar instituciones
GET  /api/games               # Listar juegos
GET  /api/progress            # Progreso del usuario
```

## ⚙️ Variables de Entorno

### Frontend (.env)
```env
PORT=3000
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_VERSION=v1
```

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://postgres:root@localhost:5433/koala_educativo?schema=public
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### PostgreSQL
```env
Host: localhost
Port: 5433
Database: koala_educativo
User: postgres
Password: root
```

## 🔄 Comandos de Inicio

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm start

# Terminal 3: Base de datos (si se usa Docker)
docker-compose up -d postgres adminer
```

## 🛡️ Consideraciones de Seguridad

- ✅ CORS configurado para localhost:3000
- ✅ Rate limiting habilitado (100 req/15min)
- ✅ Variables de entorno para secretos
- ⚠️ Cambiar credenciales en producción

## 📝 Notas

- El frontend se conecta automáticamente al backend en el puerto 3001
- PostgreSQL usa puerto 5433 (no estándar 5432) para evitar conflictos
- Todos los puertos están configurados para evitar colisiones
- Docker Compose usa red interna para servicios