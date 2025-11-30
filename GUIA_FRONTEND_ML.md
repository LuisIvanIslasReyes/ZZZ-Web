# 🎯 GUÍA FRONTEND - Dashboard Machine Learning

**Backend:** ✅ 100% Listo  
**Tu trabajo:** Crear la UI con estos endpoints

---

## 📍 Endpoints Disponibles

Base URL: `http://localhost:8000`

### 1️⃣ Información del Modelo
```http
GET /api/ml/model-info/
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "model_exists": true,
  "model_size_mb": 0.09,
  "model_type": "MachineLearning",
  "ml_service": {
    "type": "ML_PREDICTOR",
    "features_count": 10,
    "features": [
      "movement_variance",
      "activity_normalized", 
      "spo2_variance",
      "heart_rate_avg",
      "heart_rate_variance",
      "spo2_avg",
      "time_of_day",
      "duration_minutes",
      "alert_count",
      "fatigue_trend"
    ]
  },
  "training": {
    "samples": 21438,
    "date": "2025-11-29T19:02:00",
    "algorithm": "Ensemble Model",
    "performance": "High"
  },
  "quality_metrics": {
    "accuracy": 0.9262,
    "precision": 0.93,
    "recall": 0.91
  }
}
```

---

### 2️⃣ Estadísticas
```http
GET /api/ml/statistics/
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "predictions": {
    "total": 120,
    "last_24h": 48,
    "average_fatigue": 51.23
  },
  "fatigue_distribution": {
    "normal": 85,
    "moderate": 25,
    "high": 10
  }
}
```

---

### 3️⃣ Estado Re-entrenamiento
```http
GET /api/ml/retraining/
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "last_training": "2025-11-29T19:02:00",
  "next_scheduled": "2025-12-06T19:02:00",
  "available_metrics": 120,
  "min_required": 100,
  "can_retrain": true,
  "status": "ready"
}
```

---

### 4️⃣ Iniciar Re-entrenamiento (Solo Admin/Supervisor)
```http
POST /api/ml/retraining/
Authorization: Bearer <token>
Content-Type: application/json

{
  "force": false
}
```

**Respuesta (202):**
```json
{
  "status": "started",
  "message": "Re-entrenamiento iniciado",
  "estimated_time": "1-2 minutos"
}
```

---

### 5️⃣ Historial Predicciones
```http
GET /api/ml/predictions/history/?limit=50
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "count": 50,
  "predictions": [
    {
      "id": 120,
      "timestamp": "2025-11-29T18:30:00",
      "device": "ESP32-001",
      "employee": "Juan Pérez",
      "fatigue_index": 52.34,
      "hr_avg": 78.5,
      "spo2_avg": 97.2,
      "classification": "normal"
    }
  ]
}
```

---

## 🎨 Qué Mostrar en la UI

### Card 1: Información del Modelo
```
┌─────────────────────────────────┐
│ 🧠 Modelo ML          [Activo]  │
├─────────────────────────────────┤
│ Tipo:         Machine Learning  │
│ Características: 10             │
│ Tamaño:       0.09 MB           │
│ Muestras:     21,438            │
│ Score:        0.9262 (🟢 Excelente) │
│                                 │
│ Entrenado: 29/11/2025 19:02    │
│ Estado:    ✅ Funcionando       │
└─────────────────────────────────┘
```

**Fuente:** `GET /api/ml/model-info/`

---

### Card 2: Estadísticas
```
┌─────────────────────────────────┐
│ 📈 Estadísticas                 │
├─────────────────────────────────┤
│ Total:      120 predicciones    │
│ Últimas 24h: 48                 │
│ Promedio:   51.23% fatiga       │
│                                 │
│ Normal:    ████████ 85          │
│ Moderado:  ███ 25               │
│ Alto:      █ 10                 │
└─────────────────────────────────┘
```

**Fuente:** `GET /api/ml/statistics/`

---

### Card 3: Re-entrenamiento
```
┌─────────────────────────────────┐
│ 🔄 Re-entrenamiento             │
├─────────────────────────────────┤
│ Último: 29/11/2025 19:02        │
│ Próximo: En 6 días              │
│                                 │
│ Datos: 120 / 100 ✅             │
│                                 │
│ [Re-entrenar Ahora]             │
└─────────────────────────────────┘
```

**Fuente:** `GET /api/ml/retraining/`  
**Acción:** `POST /api/ml/retraining/` (botón)

**Flujo al hacer clic:**
1. Usuario → Click botón
2. Frontend → `POST /api/ml/retraining/`
3. Backend → Inicia entrenamiento (background)
4. Frontend → Mostrar spinner "Re-entrenando..."
5. Frontend → Polling cada 10s a `/api/ml/model-info/`
6. Cuando `training.date` cambie → Toast "✅ Completado"

---

### Card 4: Historial
```
┌──────────────────────────────────────────────────────┐
│ 📜 Historial                                         │
├──────────────────────────────────────────────────────┤
│ Fecha/Hora  Dispositivo  Empleado    Fatiga  Estado │
│ 29/11 18:30 ESP32-001   Juan Pérez   52%    🟢     │
│ 29/11 18:28 ESP32-002   María García 68%    🔴     │
└──────────────────────────────────────────────────────┘
```

**Fuente:** `GET /api/ml/predictions/history/?limit=50`

---

## 🎨 Colores

**Fatiga:**
- 🟢 Normal (<55%): `#10b981`
- 🟡 Moderado (55-65%): `#f59e0b`
- 🔴 Alto (>65%): `#ef4444`

**Accuracy/Métricas:**
- 🟢 Excelente (≥0.85): `#10b981`
- 🟡 Bueno (0.70-0.85): `#f59e0b`
- 🔴 Mejorable (<0.70): `#ef4444`

---

## ⏰ Auto-actualización

```javascript
// Actualizar cada cierto tiempo
setInterval(() => fetchModelInfo(), 30000);     // 30s
setInterval(() => fetchStatistics(), 60000);     // 60s
setInterval(() => fetchRetrainingStatus(), 300000); // 5min
```

---

## 🔐 Permisos

| Acción | Admin | Supervisor | Employee |
|--------|-------|------------|----------|
| Ver modelo | ✅ | ✅ | ✅ |
| Ver estadísticas | ✅ Todas | ✅ Su empresa | ❌ |
| Ver historial | ✅ Todas | ✅ Su empresa | ✅ Sus datos |
| Re-entrenar | ✅ | ✅ | ❌ |

---

## 📱 Ruta

**URL:** `/dashboard/machine-learning`

**Navegación:** Agregar link en el menú principal:
```jsx
<NavLink to="/dashboard/machine-learning">
  🧠 Machine Learning
</NavLink>
```

---

## 🧪 Probar Backend

```bash
# Terminal 1: Servidor
python manage.py runserver

# Terminal 2: Tests
python SCRIPTS\TEST\test_ml_endpoints.py
```

**Salida esperada:**
```
✅ Model Info funcionando correctamente
✅ Statistics funcionando correctamente
✅ Retraining Status funcionando correctamente
✅ Prediction History funcionando correctamente
```

---

## 📦 Código Base

### Servicio API (JavaScript/TypeScript)

```javascript
// services/mlApi.js
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getToken = () => localStorage.getItem('token');

export const mlApi = {
  // 1. Info del modelo
  getModelInfo: async () => {
    const { data } = await axios.get(`${API_URL}/api/ml/model-info/`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return data;
  },

  // 2. Estadísticas
  getStatistics: async () => {
    const { data } = await axios.get(`${API_URL}/api/ml/statistics/`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return data;
  },

  // 3. Estado re-entrenamiento
  getRetrainingStatus: async () => {
    const { data } = await axios.get(`${API_URL}/api/ml/retraining/`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return data;
  },

  // 4. Iniciar re-entrenamiento
  startRetraining: async (force = false) => {
    const { data } = await axios.post(
      `${API_URL}/api/ml/retraining/`,
      { force },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return data;
  },

  // 5. Historial
  getPredictionHistory: async (limit = 50) => {
    const { data } = await axios.get(
      `${API_URL}/api/ml/predictions/history/?limit=${limit}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return data;
  }
};
```

---

### Página Principal (React)

```jsx
// pages/MachineLearningDashboard.jsx
import React, { useState, useEffect } from 'react';
import { mlApi } from '../services/mlApi';

export const MachineLearningDashboard = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [retrainingStatus, setRetrainingStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Auto-refresh
    const interval1 = setInterval(() => mlApi.getModelInfo().then(setModelInfo), 30000);
    const interval2 = setInterval(() => mlApi.getStatistics().then(setStatistics), 60000);
    
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  const loadData = async () => {
    try {
      const [model, stats, retraining] = await Promise.all([
        mlApi.getModelInfo(),
        mlApi.getStatistics(),
        mlApi.getRetrainingStatus()
      ]);
      
      setModelInfo(model);
      setStatistics(stats);
      setRetrainingStatus(retraining);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="ml-dashboard">
      <h1>🧠 Machine Learning Dashboard</h1>
      
      {/* Card 1: Modelo */}
      <div className="card">
        <h2>🧠 Modelo ML</h2>
        {modelInfo?.model_exists ? (
          <>
            <p>Tipo: {modelInfo.model_type || 'Machine Learning'}</p>
            <p>Características: {modelInfo.ml_service.features_count}</p>
            <p>Muestras: {modelInfo.training.samples.toLocaleString()}</p>
            <p>Tamaño: {modelInfo.model_size_mb} MB</p>
            <p>Accuracy: {modelInfo.quality_metrics.accuracy?.toFixed(4)}</p>
            <p>Última actualización: {new Date(modelInfo.training.date).toLocaleDateString()}</p>
          </>
        ) : (
          <p>⚠️ Modelo no entrenado</p>
        )}
      </div>

      {/* Card 2: Estadísticas */}
      <div className="card">
        <h2>📈 Estadísticas</h2>
        <p>Total: {statistics?.predictions.total}</p>
        <p>Últimas 24h: {statistics?.predictions.last_24h}</p>
        <p>Promedio: {statistics?.predictions.average_fatigue}%</p>
      </div>

      {/* Card 3: Re-entrenamiento */}
      <div className="card">
        <h2>🔄 Re-entrenamiento</h2>
        <p>Último: {new Date(retrainingStatus?.last_training).toLocaleString()}</p>
        <p>Datos: {retrainingStatus?.available_metrics} / {retrainingStatus?.min_required}</p>
        <button 
          onClick={handleRetrain}
          disabled={!retrainingStatus?.can_retrain}
        >
          Re-entrenar Ahora
        </button>
      </div>
    </div>
  );
};
```

---

### Función Re-entrenamiento

```javascript
const handleRetrain = async () => {
  if (!window.confirm('¿Iniciar re-entrenamiento? (1-2 min)')) return;
  
  try {
    setRetraining(true);
    await mlApi.startRetraining();
    
    // Polling hasta que cambie la fecha
    const lastDate = modelInfo.training.date;
    const pollInterval = setInterval(async () => {
      const newData = await mlApi.getModelInfo();
      
      if (newData.training.date !== lastDate) {
        clearInterval(pollInterval);
        setRetraining(false);
        alert('✅ Modelo re-entrenado exitosamente');
        loadData(); // Recargar todo
      }
    }, 10000); // Cada 10 segundos
    
  } catch (error) {
    alert('❌ Error: ' + error.message);
    setRetraining(false);
  }
};
```

---

## ✅ Checklist

### Backend
- [x] Endpoints implementados
- [x] Rutas configuradas
- [x] Tests funcionando

### Frontend (Tu trabajo)
- [ ] Crear ruta `/dashboard/machine-learning`
- [ ] Crear `mlApi.js` (copiar código de arriba)
- [ ] Crear página `MachineLearningDashboard.jsx`
- [ ] Crear 4 cards (modelo, stats, re-entrenamiento, historial)
- [ ] Implementar auto-refresh
- [ ] Implementar botón re-entrenar con polling
- [ ] Agregar estilos CSS
- [ ] Agregar al menú de navegación

---

## 🎯 Prioridad

1. **MVP (mínimo viable):**
   - Card de modelo (info básica)
   - Card de estadísticas (números simples)
   - Historial básico (tabla)

2. **Mejoras:**
   - Card de re-entrenamiento con botón
   - Gráficos (barras, pie charts)
   - Filtros en historial

3. **Opcionales:**
   - Visualizaciones avanzadas
   - Animaciones
   - Exportar datos

---

## 💡 Tips

**Colores de fatiga:**
```javascript
const getFatigueColor = (fatigue) => {
  if (fatigue < 50) return '#10b981'; // Verde - Normal
  if (fatigue < 70) return '#f59e0b'; // Amarillo - Moderado
  if (fatigue < 85) return '#ff6b35'; // Naranja - Alto
  return '#ef4444'; // Rojo - Crítico
};
```

**Colores de accuracy/métricas:**
```javascript
const getAccuracyColor = (accuracy) => {
  if (accuracy >= 0.85) return '#10b981'; // Verde - Excelente
  if (accuracy >= 0.70) return '#f59e0b'; // Amarillo - Bueno
  return '#ef4444'; // Rojo - Mejorable
};
```

**Formatear números:**
```javascript
const formatNumber = (num) => num.toLocaleString('es-ES');
```

**Formatear fechas:**
```javascript
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

---

## 🎓 Características del Modelo

El modelo ML analiza **10 características** de los datos de los dispositivos:

1. **movement_variance**: Varianza en movimiento del empleado
2. **activity_normalized**: Nivel de actividad normalizado (0-1)
3. **spo2_variance**: Variabilidad en saturación de oxígeno
4. **heart_rate_avg**: Frecuencia cardíaca promedio
5. **heart_rate_variance**: Variabilidad de frecuencia cardíaca
6. **spo2_avg**: Saturación de oxígeno promedio
7. **time_of_day**: Hora del día (patrón circadiano)
8. **duration_minutes**: Duración de la sesión de trabajo
9. **alert_count**: Número de alertas previas
10. **fatigue_trend**: Tendencia de fatiga en el tiempo

**Output:** Predicción de índice de fatiga (0-100%)

---

## � Proceso de Re-entrenamiento

**¿Cuándo se re-entrena automáticamente?**
- Cada 7 días (automático)
- Cuando hay 100+ nuevas métricas

**¿Qué hace el re-entrenamiento?**
1. Recopila todas las métricas nuevas
2. Entrena el modelo con datos históricos
3. Valida el rendimiento (accuracy, precision, recall)
4. Si el nuevo modelo es mejor → Lo guarda
5. Si no mejora → Mantiene el modelo actual

**Duración:** 1-2 minutos

---

## 📊 Interpretación de Métricas

**Accuracy (Precisión General):**
- Porcentaje de predicciones correctas
- >0.85 = Excelente
- 0.70-0.85 = Bueno
- <0.70 = Necesita mejora

**Precision:**
- De las predicciones positivas, cuántas son correctas
- Importante para evitar falsas alarmas

**Recall:**
- De todos los casos reales, cuántos detecta
- Importante para no perder casos de fatiga real

---

## �📞 Dudas

- **¿El backend funciona?** → Sí, 100% probado
- **¿Qué tengo que hacer?** → Crear la UI con los 4 endpoints
- **¿Cómo pruebo?** → `python SCRIPTS\TEST\test_ml_endpoints.py`
- **¿Permisos?** → Token JWT en header Authorization
- **¿Actualización automática?** → `setInterval` cada 30s/60s
- **¿Qué modelo usa?** → Sistema de ML con 10 características
- **¿Qué predice?** → Índice de fatiga (0-100%)

---

**Fecha:** 29/11/2025  
**Backend:** ✅ Listo  
**Frontend:** 📋 Pendiente (esta guía)
