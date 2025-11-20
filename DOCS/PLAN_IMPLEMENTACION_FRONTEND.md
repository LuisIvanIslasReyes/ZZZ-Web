# 🚀 PLAN DE IMPLEMENTACIÓN - FRONTEND REACT
## Sistema de Detección de Fatiga Laboral

**Fecha de inicio:** 11 de Noviembre, 2025  
**Backend:** ✅ Completamente implementado y funcional  
**Frontend:** 📋 Por implementar según este plan  
**Tiempo estimado total:** 8-10 semanas

---

## 📊 INFORMACIÓN DEL BACKEND (YA IMPLEMENTADO)

### ✅ Backend Funcional - Configuración Actual

**Stack Backend:**
- Django 4.2.7 + Django REST Framework 3.14.0
- PostgreSQL (configurado)
- JWT Auth con djangorestframework-simplejwt
- MQTT Client (paho-mqtt) para ESP32
- ML Service con scikit-learn
- Swagger/OpenAPI con drf-spectacular

**URL Base API:** `http://localhost:8000/api/`

**CORS Configurado:** 
```
http://localhost:5173  # Vite default
http://localhost:3000  # Create React App fallback
```

**JWT Tokens:**
- Access Token: 60 minutos
- Refresh Token: 1440 minutos (24 horas)

**Documentación API Disponible:**
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/
- Schema JSON: http://localhost:8000/api/schema/

### ✅ Endpoints Implementados (50+)

#### 🔐 Autenticación (apps/users/urls.py)
```
POST   /api/auth/login/              # Login
POST   /api/auth/logout/             # Logout
POST   /api/auth/refresh/            # Refresh token
POST   /api/auth/change-password/    # Cambiar contraseña
GET    /api/auth/me/                 # Perfil actual
```

#### 👔 Admin Endpoints
```
GET    /api/admin/supervisors/       # Listar supervisores
POST   /api/admin/supervisors/       # Crear supervisor
GET    /api/admin/supervisors/{id}/  # Detalle supervisor
PUT    /api/admin/supervisors/{id}/  # Actualizar supervisor
DELETE /api/admin/supervisors/{id}/  # Eliminar supervisor
GET    /api/admin/stats/             # Estadísticas globales
```

#### 👨‍💼 Supervisor Endpoints
```
GET    /api/supervisor/employees/       # Listar empleados
POST   /api/supervisor/employees/       # Crear empleado
GET    /api/supervisor/employees/{id}/  # Detalle empleado
PUT    /api/supervisor/employees/{id}/  # Actualizar empleado
DELETE /api/supervisor/employees/{id}/  # Eliminar empleado
```

#### 📱 Devices (ViewSet - Router)
```
GET    /api/devices/           # Listar dispositivos
POST   /api/devices/           # Crear dispositivo
GET    /api/devices/{id}/      # Detalle dispositivo
PUT    /api/devices/{id}/      # Actualizar dispositivo
DELETE /api/devices/{id}/      # Eliminar dispositivo
```

#### 📊 Metrics (ViewSet - Router)
```
GET    /api/sensor-data/                      # Datos crudos sensores
GET    /api/processed-metrics/                # Métricas procesadas
GET    /api/processed-metrics/latest/         # Última métrica
GET    /api/processed-metrics/by_employee/    # Por empleado
GET    /api/processed-metrics/statistics/     # Estadísticas
```

#### 🚨 Alerts (ViewSet - Router)
```
GET    /api/alerts/                    # Listar alertas
POST   /api/alerts/                    # Crear alerta
GET    /api/alerts/{id}/               # Detalle alerta
PUT    /api/alerts/{id}/               # Actualizar alerta
POST   /api/alerts/{id}/resolve/       # Resolver alerta
POST   /api/alerts/{id}/unresolve/     # Reabrir alerta
GET    /api/alerts/statistics/         # Estadísticas alertas
GET    /api/alerts/active/             # Alertas activas
GET    /api/alerts/by_employee/        # Por empleado
```

#### 💡 Recommendations (ViewSet - Router)
```
GET    /api/recommendations/              # Listar recomendaciones
POST   /api/recommendations/              # Crear recomendación
GET    /api/recommendations/{id}/         # Detalle
POST   /api/recommendations/{id}/apply/   # Aplicar recomendación
GET    /api/recommendations/pending/      # Pendientes
GET    /api/recommendations/statistics/   # Estadísticas
```

#### 📈 Dashboard (ViewSet - Router)
```
GET    /api/dashboard/overview/              # Estadísticas generales
GET    /api/dashboard/real_time/             # Métricas tiempo real
GET    /api/dashboard/employee_dashboard/    # Dashboard empleado
GET    /api/dashboard/supervisor_dashboard/  # Dashboard supervisor
GET    /api/dashboard/admin_dashboard/       # Dashboard admin
```

#### 📊 Visualizations (ViewSet - Router)
```
GET    /api/visualizations/fatigue_trends/     # Tendencias fatiga
GET    /api/visualizations/alert_distribution/ # Distribución alertas
GET    /api/visualizations/employee_comparison/# Comparación empleados
GET    /api/visualizations/hourly_patterns/    # Patrones horarios
```

#### 📄 Reports (ViewSet - Router)
```
GET    /api/reports/daily/              # Reporte diario
GET    /api/reports/weekly/             # Reporte semanal
GET    /api/reports/monthly/            # Reporte mensual
GET    /api/reports/employee_summary/   # Resumen empleado
GET    /api/reports/export/             # Exportar datos
```

#### 👷 Employee Endpoints
```
GET    /api/employee/me/  # Perfil empleado
```

**NOTA:** El empleado accede a sus datos mediante `/api/dashboard/employee_dashboard/`, `/api/processed-metrics/`, etc., con filtrado automático por usuario autenticado.

---

## 🎯 OBJETIVOS DEL FRONTEND

### Aplicación React + TypeScript que provea:

1. ✅ **Sistema de Autenticación JWT** con auto-refresh
2. ✅ **Routing Protegido** por roles (Admin, Supervisor, Employee)
3. ✅ **3 Dashboards Diferentes** según rol del usuario
4. ✅ **CRUD Completo** de Supervisores y Empleados
5. ✅ **Gestión de Dispositivos** (asignación, estado)
6. ✅ **Visualización de Métricas** en tiempo real con gráficas
7. ✅ **Sistema de Alertas** visual e interactivo
8. ✅ **Panel de Recomendaciones** con aplicación
9. ✅ **Diseño Responsivo** con DaisyUI
10. ✅ **Actualización en Tiempo Real** mediante polling

---

## 📋 PLAN DE FASES DETALLADO

### Resumen de Fases

| Fase | Nombre | Duración | Prioridad | Archivo |
|------|--------|----------|-----------|---------|
| 1 | Setup y Configuración Inicial | 2-3 días | 🔴 Crítica | [FASE_1_SETUP_INICIAL.md](./FASE_1_SETUP_INICIAL.md) |
| 2 | Types y Configuración de API | 2-3 días | 🔴 Crítica | [FASE_2_TYPES_Y_API.md](./FASE_2_TYPES_Y_API.md) |
| 3 | Services Layer - Integración API | 2-3 días | 🔴 Crítica | [FASE_3_SERVICES.md](./FASE_3_SERVICES.md) |
| 4 | Custom Hooks y Utils | 2 días | 🔴 Crítica | [FASE_4_HOOKS_UTILS.md](./FASE_4_HOOKS_UTILS.md) |
| 5 | Autenticación y Context | 3 días | 🔴 Crítica | [FASE_5_AUTH_CONTEXT.md](./FASE_5_AUTH_CONTEXT.md) |
| 6 | Componentes Comunes | 3-4 días | 🟡 Alta | [FASE_6_COMPONENTES_COMUNES.md](./FASE_6_COMPONENTES_COMUNES.md) |
| 7 | Componentes de Gráficas | 2-3 días | 🟡 Alta | [FASE_7_COMPONENTES_GRAFICAS.md](./FASE_7_COMPONENTES_GRAFICAS.md) |
| 8 | Layouts y Routing | 2-3 días | 🔴 Crítica | [FASE_8_LAYOUTS_ROUTING.md](./FASE_8_LAYOUTS_ROUTING.md) |
| 9 | Dashboards por Rol | 4-5 días | 🔴 Crítica | [FASE_9_DASHBOARDS.md](./FASE_9_DASHBOARDS.md) |
| 10 | CRUD de Usuarios | 3-4 días | 🟡 Alta | [FASE_10_CRUD_USUARIOS.md](./FASE_10_CRUD_USUARIOS.md) |
| 11 | Sistema de Alertas | 3-4 días | 🟡 Alta | [FASE_11_SISTEMA_ALERTAS.md](./FASE_11_SISTEMA_ALERTAS.md) |
| 12 | Recomendaciones y Dispositivos | 2-3 días | 🟢 Media | [FASE_12_RECOMENDACIONES.md](./FASE_12_RECOMENDACIONES.md) |
| 13 | Testing y QA | 5-7 días | 🟡 Alta | [FASE_13_TESTING_QA.md](./FASE_13_TESTING_QA.md) |
| 14 | Deployment y Optimización | 2-3 días | 🟡 Alta | [FASE_14_DEPLOYMENT.md](./FASE_14_DEPLOYMENT.md) |

**Tiempo Total Estimado:** 8-10 semanas

---

## 🎯 ESTRUCTURA DE CADA FASE

Cada fase incluye:
- ✅ **Objetivos claros** - Qué se logrará
- 📋 **Tareas detalladas** - Pasos específicos con código
- 📝 **Checklist de completitud** - Verificación de progreso
- 🧪 **Sección de pruebas** - Cómo verificar que funciona
- 🎯 **Resultado esperado** - Estado final de la fase
- 🚀 **Siguiente paso** - Conexión con la siguiente fase

---

## 📊 DEPENDENCIAS ENTRE FASES

```
FASE 1 (Setup)
    ↓
FASE 2 (Types & API)
    ↓
FASE 3 (Services) ← Base para todo
    ↓
FASE 4 (Hooks) + FASE 5 (Auth Context)
    ↓
FASE 6 (Componentes Comunes) + FASE 7 (Gráficas)
    ↓
FASE 8 (Routing & Layouts)
    ↓
FASE 9 (Dashboards) ← Feature principal
    ↓
FASE 10 (CRUD) + FASE 11 (Alertas) + FASE 12 (Recomendaciones)
    ↓
FASE 13 (Testing)
    ↓
FASE 14 (Deployment)
```

---

## 🚨 NOTAS IMPORTANTES

### Antes de Empezar

1. **Backend debe estar corriendo:**
   ```bash
   # En terminal del backend
   cd ZZZ-Backend
   .\venv\Scripts\Activate.ps1
   python manage.py runserver
   ```

2. **Verificar CORS configurado:**
   - En `ZZZ-Backend/config/settings.py` debe incluir `http://localhost:5173`

3. **Crear superusuario si no existe:**
   ```bash
   python create_superuser.py
   ```

4. **Verificar Swagger disponible:**
   - http://localhost:8000/api/docs/

### Durante la Implementación

- ✅ Completar cada fase en orden secuencial
- ✅ Verificar el checklist antes de pasar a la siguiente
- ✅ Probar cada componente/servicio inmediatamente después de crearlo
- ✅ Hacer commits frecuentes con mensajes descriptivos
- ✅ Documentar problemas o decisiones importantes

### Testing Continuo

- Probar login después de FASE 5
- Probar routing después de FASE 8
- Probar dashboards después de FASE 9
- Testing exhaustivo en FASE 13

---

## 🎓 RECURSOS DE APOYO

### Documentación Backend
- **Swagger UI:** http://localhost:8000/api/docs/
- **README:** ZZZ-Backend/README.md
- **Guía de API:** ZZZ-Backend/GUIA_PRUEBAS_API.md

### Documentación Frontend
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **DaisyUI:** https://daisyui.com/components/
- **Chart.js:** https://www.chartjs.org/docs/latest/
- **React Router:** https://reactrouter.com/

### Herramientas
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux snippets
- **Browser DevTools:**
  - React Developer Tools
  - Redux DevTools (si se usa)

---

