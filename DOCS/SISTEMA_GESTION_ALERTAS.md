# Sistema de Gestión de Alertas - Flujo de Resolución

## 📋 Descripción General

Se ha implementado un sistema completo de gestión y resolución de alertas con un flujo visual e intuitivo que permite a los usuarios procesar alertas a través de diferentes estados de manera estructurada.

## 🔄 Estados de Alertas

El sistema maneja 4 estados principales:

### 1. **Pending (Pendiente)** ⏳
- **Estado inicial** de todas las alertas nuevas
- Indica que la alerta requiere atención inmediata
- Color: Amarillo
- **Acciones disponibles:**
  - Reconocer → Cambia a `Acknowledged`
  - Resolver → Cambia a `Resolved` (acción directa)
  - Descartar → Cambia a `Dismissed`

### 2. **Acknowledged (Reconocida)** 👀
- La alerta ha sido vista y está siendo atendida
- Indica que alguien está trabajando en resolver el problema
- Color: Azul
- **Acciones disponibles:**
  - Resolver → Cambia a `Resolved`
  - Descartar → Cambia a `Dismissed`

### 3. **Resolved (Resuelta)** ✅
- La alerta ha sido completamente atendida
- El problema que generó la alerta fue solucionado
- Color: Verde
- **Estado final** - No hay más acciones disponibles

### 4. **Dismissed (Descartada)** ❌
- La alerta fue marcada como falso positivo
- No requería acción real
- Color: Gris
- **Estado final** - No hay más acciones disponibles

## 🎯 Flujo de Trabajo

```
┌─────────────┐
│  PENDING    │ ⏳ Nueva alerta detectada
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ ACKNOWLEDGED │   │   DISMISSED   │ ❌ Falso positivo
└──────┬───────┘   └──────────────┘
       │                    
       │                    
       ▼                    
┌──────────────┐           
│   RESOLVED   │ ✅ Problema resuelto
└──────────────┘           
```

## 🆕 Componente AlertWorkflowModal

### Características Principales

1. **Interfaz Visual Intuitiva**
   - Diseño con tarjetas interactivas para cada acción
   - Iconos y colores distintivos por severidad
   - Feedback visual inmediato de la acción seleccionada

2. **Información Completa**
   - Resumen de métricas del empleado
   - Score de fatiga con barra de progreso visual
   - Frecuencia cardíaca, SpO2, temperatura (si disponibles)
   - Recomendaciones del sistema ML

3. **Documentación de Acciones**
   - Campo opcional para añadir notas
   - Documenta el proceso de resolución
   - Facilita auditoría y seguimiento

4. **Acciones Contextuales**
   - Solo muestra acciones válidas según el estado actual
   - Previene transiciones de estado inválidas
   - Confirmación antes de acciones críticas

### Ubicación del Archivo
```
src/
  components/
    alerts/
      AlertWorkflowModal.tsx    # Componente principal
      index.ts                  # Exportaciones
```

## 📍 Páginas Actualizadas

### 1. Admin - AlertsListPage
**Ruta:** `src/pages/admin/AlertsListPage.tsx`

**Cambios implementados:**
- Botón "Gestionar" para alertas pendientes y reconocidas
- Integración con `AlertWorkflowModal`
- Acciones masivas mejoradas con confirmación
- Modal de detalles separado para información completa

### 2. Supervisor - SupervisorTeamAlertsPage
**Ruta:** `src/pages/supervisor/SupervisorTeamAlertsPage.tsx`

**Cambios implementados:**
- Botón "Gestionar" con diseño ZZZ Style
- Integración completa con el nuevo modal
- Indicadores visuales de estado mejorados
- Filtros por severidad y estado

## 🎨 Características de UX

### Diseño Visual
- **Colores por Severidad:**
  - 🔴 Critical: Rojo - Requiere atención inmediata
  - 🟠 High: Naranja - Alta prioridad
  - 🟡 Medium: Amarillo - Prioridad media
  - 🔵 Low: Azul - Baja prioridad

### Interactividad
- **Hover Effects:** Resalta las tarjetas de acción al pasar el mouse
- **Selección Visual:** La acción seleccionada se destaca con borde azul y fondo
- **Estados de Loading:** Indica cuando se está procesando una acción
- **Animaciones Suaves:** Transiciones fluidas entre estados

### Feedback al Usuario
- **Toast Notifications:** Confirmación de acciones exitosas
- **Mensajes de Error:** Alerta si algo falla
- **Confirmaciones:** Diálogo antes de acciones irreversibles
- **Estados Visuales:** Indica claramente el estado actual de cada alerta

## 🔧 Uso del Componente

### Ejemplo de Implementación

```tsx
import { AlertWorkflowModal } from '../../components/alerts';

function MyAlertsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FatigueAlert | null>(null);

  const handleManageAlert = (alert: FatigueAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Tu lista de alertas */}
      <button onClick={() => handleManageAlert(alert)}>
        Gestionar
      </button>

      {/* Modal de gestión */}
      <AlertWorkflowModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
        alert={selectedAlert}
        onUpdate={loadAlerts} // Función para recargar alertas
      />
    </>
  );
}
```

## 📊 Métricas Mostradas

El modal muestra las siguientes métricas cuando están disponibles:

1. **Información del Empleado**
   - Nombre o ID del empleado
   - Dispositivo asociado

2. **Métricas de Salud**
   - Score de Fatiga (0-100) con barra visual
   - Frecuencia Cardíaca (bpm)
   - Saturación de Oxígeno SpO2 (%)
   - Temperatura Corporal (°C)

3. **Metadatos de la Alerta**
   - Fecha y hora de creación
   - Fecha de reconocimiento (si aplica)
   - Fecha de resolución (si aplica)
   - Severidad de la alerta
   - Estado actual

4. **Recomendaciones ML**
   - Sugerencias del sistema de Machine Learning
   - Acciones recomendadas

## 🔐 Validaciones y Seguridad

1. **Validación de Estados**
   - Solo muestra acciones válidas para el estado actual
   - Previene transiciones incorrectas

2. **Confirmaciones**
   - Solicita confirmación para descartar alertas
   - Confirmación en acciones masivas

3. **Manejo de Errores**
   - Captura y muestra errores de API
   - Previene múltiples clics durante procesamiento
   - Rollback automático en caso de fallo

## 🚀 Mejoras Implementadas

### Respecto al Sistema Anterior

1. **UX Mejorada**
   - ✅ Flujo visual claro y guiado
   - ✅ Menos clics para completar acciones
   - ✅ Feedback inmediato de acciones

2. **Funcionalidad**
   - ✅ Campo de notas para documentar acciones
   - ✅ Visualización mejorada de métricas
   - ✅ Acciones contextuales inteligentes

3. **Mantenibilidad**
   - ✅ Componente reutilizable
   - ✅ Lógica centralizada
   - ✅ Fácil de extender

## 📝 Notas Técnicas

### Servicios Utilizados
```typescript
// Acciones disponibles en alertService
- acknowledgeAlert(id: number): Promise<FatigueAlert>
- resolveAlert(id: number): Promise<FatigueAlert>
- dismissAlert(id: number): Promise<FatigueAlert>
```

### Tipos TypeScript
```typescript
type AlertStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';
type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
```

## 🎓 Buenas Prácticas

1. **Siempre documenta las acciones** usando el campo de notas
2. **Verifica las métricas** antes de resolver una alerta
3. **Lee las recomendaciones** del sistema ML
4. **Solo descarta alertas** que sean claramente falsos positivos
5. **Reconoce alertas** cuando empieces a trabajar en ellas

## 🔮 Futuras Mejoras Posibles

- [ ] Historial de cambios de estado
- [ ] Asignación de alertas a usuarios específicos
- [ ] Notificaciones en tiempo real
- [ ] Integración con sistema de tickets
- [ ] Exportación de reportes de alertas
- [ ] Dashboard de métricas de respuesta
- [ ] Escalamiento automático de alertas no atendidas
- [ ] Comentarios y colaboración en alertas

---

**Fecha de Implementación:** Noviembre 27, 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado y Operativo
