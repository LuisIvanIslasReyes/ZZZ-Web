# 🚀 Frontend - Sistema de Detección de Fatiga Laboral

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-4-green.svg)](https://daisyui.com/)

Sistema web frontend para monitoreo de fatiga laboral mediante sensores IoT, con dashboards interactivos, sistema de alertas y recomendaciones basadas en Machine Learning.

---

## 📋 INFORMACIÓN DEL PROYECTO

**Backend:** Django REST Framework (✅ Ya implementado y funcional)  
**Frontend:** React + TypeScript + Vite + DaisyUI  
**Comunicación:** REST API + JWT Authentication  
**Gráficas:** Chart.js  
**Estado Global:** React Context API

---

## 🏗️ ARQUITECTURA

```
┌─────────────────┐                                  
│  ESP32 Sensors  │                                  
└────────┬────────┘                                  
         │ MQTT                                       
         ▼                                            
┌─────────────────┐      REST API (JWT)              
│  Django Backend │ ◄───────────────────┐            
│  (Ya implementado)│                    │            
└─────────────────┘                      │            
                                         │            
                              ┌──────────┴──────────┐
                              │   React Frontend    │
                              │  (Este proyecto)    │
                              └─────────────────────┘
                                         │            
                              ┌──────────┴──────────┐
                              │  3 Dashboards:      │
                              │  - Admin            │
                              │  - Supervisor       │
                              │  - Employee         │
                              └─────────────────────┘
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

### Documentos de Planificación

| Documento | Descripción |
|-----------|-------------|
| **SYSTEM_ANALYSIS.md** | Análisis completo del sistema (backend + frontend) |
| **PLAN_IMPLEMENTACION_FRONTEND.md** | Plan maestro con 14 fases detalladas |
| **RESUMEN_FASES_4_14.md** | Resumen ejecutivo de fases 4-14 |

### Documentos por Fase

| Fase | Archivo | Contenido |
|------|---------|-----------|
| 1 | FASE_1_SETUP_INICIAL.md | Setup Vite, TailwindCSS, DaisyUI, dependencias |
| 2 | FASE_2_TYPES_Y_API.md | TypeScript types, configuración Axios |
| 3 | FASE_3_SERVICES.md | Services layer completo (auth, users, metrics, alerts, etc.) |
| 4-14 | RESUMEN_FASES_4_14.md | Hooks, componentes, routing, dashboards, testing, deploy |

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### Por Rol de Usuario

**👔 Administrador:**
- ✅ Dashboard con estadísticas globales
- ✅ Gestión CRUD de supervisores
- ✅ Vista de todos los dispositivos
- ✅ Logs del sistema

**👨‍💼 Supervisor:**
- ✅ Dashboard de equipo con métricas agregadas
- ✅ Gestión CRUD de empleados
- ✅ Asignación de dispositivos
- ✅ Panel de alertas activas/resueltas
- ✅ Sistema de recomendaciones
- ✅ Gráficas comparativas de fatiga

**👷 Empleado:**
- ✅ Dashboard personal con métricas en tiempo real
- ✅ Histórico de fatiga (gráficas)
- ✅ Mis alertas
- ✅ Estadísticas individuales
- ✅ Recomendaciones personales

### Features Técnicas

- 🔐 **Autenticación JWT** con auto-refresh
- 🔄 **Actualización en tiempo real** mediante polling
- 📊 **6 Tipos de gráficas** con Chart.js
- 🚨 **Sistema de alertas** visual e interactivo
- 📱 **Diseño responsivo** con DaisyUI
- 🎨 **Tema personalizado** con colores de fatiga
- ⚡ **Performance optimizado** con lazy loading
- 🧪 **Testing** con Vitest y Playwright

---

## 🚀 INICIO RÁPIDO

### Prerequisitos

- Node.js 18+ 
- npm o yarn
- Backend Django corriendo en `http://localhost:8000`

### Instalación

```bash
# 1. Crear proyecto
npm create vite@latest fatigue-frontend -- --template react-ts
cd fatigue-frontend

# 2. Instalar dependencias principales
npm install
npm install react-router-dom axios date-fns clsx
npm install chart.js react-chartjs-2

# 3. Instalar TailwindCSS + DaisyUI
npm install -D tailwindcss postcss autoprefixer daisyui
npx tailwindcss init -p

# 4. Configurar variables de entorno
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
echo "VITE_API_TIMEOUT=10000" >> .env

# 5. Iniciar desarrollo
npm run dev
```

Visita: http://localhost:5173

### Configuración Rápida

**1. Configurar `tailwind.config.js`:**
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{ light: { /* ver FASE_1 */ } }],
  },
}
```

**2. Actualizar `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**3. Ver FASE_1_SETUP_INICIAL.md para configuración completa**

---

## 📂 ESTRUCTURA DEL PROYECTO

```
src/
├── assets/              # Imágenes, iconos
├── components/
│   ├── common/          # 9 componentes reutilizables
│   ├── charts/          # 6 componentes de gráficas
│   ├── alerts/          # 5 componentes de alertas
│   ├── dashboard/       # Widgets de dashboard
│   ├── employees/       # Componentes de empleados
│   └── auth/            # ProtectedRoute
├── contexts/
│   └── AuthContext.tsx  # Estado de autenticación
├── hooks/
│   ├── useAuth.ts       # Hook de auth
│   ├── useFetch.ts      # Fetching con loading/error
│   └── useRealtime.ts   # Polling
├── layouts/
│   ├── AuthLayout.tsx   # Layout de login
│   └── MainLayout.tsx   # Layout principal con sidebar
├── pages/
│   ├── admin/           # Páginas de admin
│   ├── supervisor/      # Páginas de supervisor
│   ├── employee/        # Páginas de empleado
│   └── LoginPage.tsx
├── router/
│   └── index.tsx        # Configuración de rutas
├── services/
│   ├── api.ts           # Config Axios + interceptors
│   ├── authService.ts   # Login, logout, refresh
│   ├── userService.ts   # CRUD usuarios
│   ├── metricsService.ts
│   ├── alertService.ts
│   ├── deviceService.ts
│   └── recommendationService.ts
├── types/
│   ├── user.types.ts
│   ├── device.types.ts
│   ├── metrics.types.ts
│   ├── alert.types.ts
│   └── recommendation.types.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── colorUtils.ts
│   └── chartConfig.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🔧 SCRIPTS DISPONIBLES

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build            # Compila para producción
npm run preview          # Preview del build

# Linting
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Fix automático de errores

# Formateo
npm run format           # Formatea código con Prettier

# Testing (después de FASE 13)
npm run test             # Ejecuta tests unitarios
npm run test:e2e         # Ejecuta tests E2E
```

---

## 🔐 AUTENTICACIÓN

### Flujo de Login

```typescript
// 1. Usuario ingresa credenciales
await authService.login(email, password);

// 2. Backend devuelve tokens JWT
{
  access: "eyJ0eXAiOiJKV1QiLCJhbGc...",  // 60 min
  refresh: "eyJ0eXAiOiJKV1QiLCJhbGc...", // 24 horas
  user: { id, email, role, ... }
}

// 3. Tokens guardados en localStorage
localStorage.setItem('access_token', access);
localStorage.setItem('refresh_token', refresh);

// 4. Axios auto-inject token en cada request
headers: { Authorization: `Bearer ${access_token}` }

// 5. Auto-refresh cuando expira
// Interceptor detecta 401 → refresh → retry request
```

### Protección de Rutas

```typescript
<ProtectedRoute allowedRoles={['admin', 'supervisor']}>
  <SupervisorDashboard />
</ProtectedRoute>
```

---

## 📊 ENDPOINTS DE LA API

Ver **PLAN_IMPLEMENTACION_FRONTEND.md** para lista completa de 50+ endpoints.

**Principales:**

```typescript
// Auth
POST   /api/auth/login/
POST   /api/auth/logout/
POST   /api/auth/refresh/
GET    /api/auth/me/

// Dashboard
GET    /api/dashboard/overview/
GET    /api/dashboard/employee_dashboard/
GET    /api/dashboard/supervisor_dashboard/
GET    /api/dashboard/admin_dashboard/

// Metrics
GET    /api/processed-metrics/
GET    /api/processed-metrics/latest/
GET    /api/processed-metrics/statistics/

// Alerts
GET    /api/alerts/
POST   /api/alerts/{id}/resolve/
GET    /api/alerts/statistics/

// Recommendations
GET    /api/recommendations/
POST   /api/recommendations/{id}/apply/
```

---

## 🎨 DISEÑO Y TEMAS

### Paleta de Colores (Fatiga)

```typescript
// colorUtils.ts
export function getFatigueColor(fatigue: number): string {
  if (fatigue < 30) return '#10b981'; // Verde (normal)
  if (fatigue < 50) return '#f59e0b'; // Amarillo (precaución)
  if (fatigue < 70) return '#fb923c'; // Naranja (advertencia)
  return '#ef4444';                   // Rojo (crítico)
}
```

### Componentes DaisyUI

- `btn`, `btn-primary`, `btn-ghost`
- `card`, `card-body`
- `badge`, `badge-success`, `badge-error`
- `modal`, `alert`, `table`
- `loading`, `stat`, `progress`

---

## 📈 PLAN DE IMPLEMENTACIÓN

### Fases Críticas (Orden sugerido)

1. **FASE 1-3** (1 semana) - Setup, Types, Services
2. **FASE 4-5** (4 días) - Hooks, Auth Context
3. **FASE 6-8** (1 semana) - Componentes, Routing
4. **FASE 9** (1 semana) - Dashboards (Feature principal)
5. **FASE 10-12** (1.5 semanas) - CRUD, Alertas, Recomendaciones
6. **FASE 13-14** (1 semana) - Testing, Deploy

**Total: 8-10 semanas**

---

## 🧪 TESTING

### Unit Tests (Vitest)

```bash
npm install -D vitest @testing-library/react
```

```typescript
// Ejemplo: Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
```

```typescript
// Ejemplo: login.spec.ts
test('login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/admin/dashboard');
});
```

---

## 🚀 DEPLOYMENT

### Opción 1: Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Opción 2: Netlify

```bash
netlify deploy --prod
```

### Configuración de Producción

**`.env.production`:**
```env
VITE_API_BASE_URL=https://api-production.example.com/api
VITE_API_TIMEOUT=15000
```

**Verificar CORS en backend:**
```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    'https://fatigue-app.vercel.app',
]
```

---

## 📖 RECURSOS

### Documentación
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [DaisyUI Components](https://daisyui.com/components/)
- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
- [React Router](https://reactrouter.com/)

### Backend
- Backend README: `../ZZZ-Backend/README.md`
- Swagger: http://localhost:8000/api/docs/
- Guía API: `../ZZZ-Backend/GUIA_PRUEBAS_API.md`

---

## 🤝 CONTRIBUCIÓN

1. Seguir el plan de fases en orden
2. Completar checklist de cada fase antes de continuar
3. Commits descriptivos: `feat: agregar AuthContext` / `fix: corregir polling interval`
4. Probar cada feature inmediatamente después de implementarla

---

## 📝 NOTAS IMPORTANTES

### Antes de Empezar

✅ Backend debe estar corriendo en http://localhost:8000  
✅ Verificar que CORS incluye `http://localhost:5173`  
✅ Crear superusuario en backend si no existe:
```bash
cd ../ZZZ-Backend
python create_superuser.py
```

### Durante el Desarrollo

- Revisar Swagger (http://localhost:8000/api/docs/) para entender endpoints
- Usar React DevTools para debugging
- Verificar Network tab para requests/responses
- Consultar documentos de fase correspondiente

---

## 🎓 SOPORTE

**¿Dudas sobre una fase específica?**  
→ Consultar `FASE_X_*.md` correspondiente

**¿Problemas con el backend?**  
→ Ver `../ZZZ-Backend/TROUBLESHOOTING.md`

**¿Estructura general?**  
→ Ver `SYSTEM_ANALYSIS.md`

---

## 📊 PROGRESO

- [ ] FASE 1: Setup y Configuración
- [ ] FASE 2: Types y API
- [ ] FASE 3: Services Layer
- [ ] FASE 4: Hooks y Utils
- [ ] FASE 5: Auth Context
- [ ] FASE 6: Componentes Comunes
- [ ] FASE 7: Componentes de Gráficas
- [ ] FASE 8: Layouts y Routing
- [ ] FASE 9: Dashboards
- [ ] FASE 10: CRUD Usuarios
- [ ] FASE 11: Sistema de Alertas
- [ ] FASE 12: Recomendaciones
- [ ] FASE 13: Testing
- [ ] FASE 14: Deployment

---

## 📄 LICENCIA

MIT

---

## 👥 AUTORES

- **Backend:** LuisIvanIslasReyes
- **Frontend:** (Tu nombre aquí)

---

**¡Éxito con la implementación del frontend!** 🚀
