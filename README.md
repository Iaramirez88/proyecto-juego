# Koala Educativo - Plataforma Educativa

Plataforma educativa interactiva con arquitectura separada de frontend React y backend Node.js/PostgreSQL.

## 🏗️ Arquitectura del Proyecto

```
ProEducativo-koala/
├── frontend/          # Aplicación React
├── backend/           # API REST Node.js + TypeScript
├── database/          # Esquemas y documentación de BD
├── docs/             # Documentación del proyecto
├── docker-compose.yml # Configuración Docker
└── README.md         # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- Docker & Docker Compose (recomendado)
- Git

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ProEducativo-koala
```

### 2. Configurar Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

### 4. Ejecutar con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres adminer

# En terminal separado, ejecutar backend
cd backend && npm run dev

# En otro terminal, ejecutar frontend  
cd frontend && npm start
```

### 5. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database Admin**: http://localhost:8080
- **API Health**: http://localhost:3001/health

## 📚 Documentación Específica

- [Backend README](./backend/README.md) - Configuración y desarrollo del API
- [Arquitectura de Base de Datos](./database/README.md) - Esquemas y migraciones
- [Análisis de Feedback](./database/ANALISIS_FEEDBACK_CLIENTE.md) - Cambios arquitectónicos

## 🛠️ Desarrollo

```
src
    |
    assets
    |     |
    |     fonts - (fonts used in project)
    |     |
    |     images - (in root folder we found common images)
    |     |    |
    |     |    games - (specific images used in game)
    |     styles - (common styles used in project)
    components
    |         |
    |         games - (components used in route "games")
    |         |
    |         shared - (common components)
    context - (component used for save global state, and shared
    |           resource   through the app)
    routes - (routes defined for each game)
    |
    utils - (files to load images, and set data for game)

```
