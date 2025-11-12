# FASE 1: SETUP Y CONFIGURACIÓN INICIAL
**Duración:** 2-3 días  
**Prioridad:** 🔴 Crítica

---

## 📋 Objetivos de la Fase

- Crear proyecto Vite con React + TypeScript
- Configurar TailwindCSS + DaisyUI
- Instalar todas las dependencias necesarias
- Configurar ESLint + Prettier
- Crear estructura de carpetas
- Configurar variables de entorno

---

## ✅ Tareas Detalladas

### 1.1 Creación del Proyecto Base

**Comando:**
```bash
npm create vite@latest fatigue-frontend -- --template react-ts
cd fatigue-frontend
npm install
```

**Verificar que se crea:**
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`

### 1.2 Instalación de Dependencias Principales

```bash
# Routing
npm install react-router-dom

# HTTP Client
npm install axios

# Estado y Context
# (React Context API - ya incluido, no requiere instalación)

# Date utilities
npm install date-fns

# Utilidades
npm install clsx
```

### 1.3 Instalación de TailwindCSS + DaisyUI

```bash
# TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# DaisyUI
npm install -D daisyui
```

**Configurar `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#06b6d4",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}
```

**Actualizar `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-base-200;
}

::-webkit-scrollbar-thumb {
  @apply bg-base-300 rounded-lg;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-base-content/30;
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}
```

### 1.4 Instalación de Chart.js

```bash
npm install chart.js react-chartjs-2
```

### 1.5 Instalación de Herramientas de Desarrollo

```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D @types/node
```

**Crear `.eslintrc.json`:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Crear `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

### 1.6 Configuración de Variables de Entorno

**Crear `.env`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
```

**Crear `.env.example`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=10000
```

**Actualizar `.gitignore`:**
```gitignore
# Dependencies
node_modules

# Build
dist
dist-ssr

# Environment
.env
.env.local
.env.production

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### 1.7 Estructura de Carpetas

**Crear la siguiente estructura en `src/`:**
```
src/
├── assets/              # Imágenes, iconos, etc.
├── components/
│   ├── common/          # Componentes reutilizables
│   ├── charts/          # Componentes de gráficas
│   ├── alerts/          # Componentes de alertas
│   ├── dashboard/       # Widgets de dashboard
│   ├── employees/       # Componentes de empleados
│   └── auth/            # ProtectedRoute, etc.
├── contexts/
│   └── AuthContext.tsx  # Context de autenticación
├── hooks/
│   ├── useAuth.ts       # Hook de autenticación
│   ├── useFetch.ts      # Hook de fetching
│   └── useRealtime.ts   # Hook de polling
├── layouts/
│   ├── AuthLayout.tsx   # Layout para login
│   └── MainLayout.tsx   # Layout principal
├── pages/
│   ├── LoginPage.tsx
│   ├── admin/
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── Supervisors.tsx
│   │   └── Devices.tsx
│   ├── supervisor/
│   │   ├── Dashboard.tsx
│   │   ├── Alerts.tsx
│   │   └── Employees.tsx
│   ├── employee/
│   │   ├── Dashboard.tsx
│   │   └── Recommendations.tsx
│   └── NotFound.tsx
├── router/
│   └── index.tsx        # Configuración de rutas
├── services/
│   ├── api.ts           # Configuración Axios
│   ├── authService.ts   # Servicio de autenticación
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
│   ├── formatters.ts    # Formateo de fechas, nombres, etc.
│   ├── validators.ts    # Validaciones de forms
│   ├── colorUtils.ts    # Utilidades de colores
│   └── chartConfig.ts   # Config de Chart.js
├── App.tsx
├── main.tsx
└── index.css
```

**Comandos para crear carpetas (PowerShell):**
```powershell
# Desde la raíz del proyecto
New-Item -ItemType Directory -Path src/assets
New-Item -ItemType Directory -Path src/components/common
New-Item -ItemType Directory -Path src/components/charts
New-Item -ItemType Directory -Path src/components/alerts
New-Item -ItemType Directory -Path src/components/dashboard
New-Item -ItemType Directory -Path src/components/employees
New-Item -ItemType Directory -Path src/components/auth
New-Item -ItemType Directory -Path src/contexts
New-Item -ItemType Directory -Path src/hooks
New-Item -ItemType Directory -Path src/layouts
New-Item -ItemType Directory -Path src/pages/admin
New-Item -ItemType Directory -Path src/pages/supervisor
New-Item -ItemType Directory -Path src/pages/employee
New-Item -ItemType Directory -Path src/router
New-Item -ItemType Directory -Path src/services
New-Item -ItemType Directory -Path src/types
New-Item -ItemType Directory -Path src/utils
```

### 1.8 Configuración de Path Aliases

**Actualizar `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@router': path.resolve(__dirname, './src/router'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
})
```

**Actualizar `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@contexts/*": ["./src/contexts/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@layouts/*": ["./src/layouts/*"],
      "@pages/*": ["./src/pages/*"],
      "@router/*": ["./src/router/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.9 Scripts de Package.json

**Actualizar `package.json` con scripts útiles:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

### 1.10 Verificación de la Instalación

**Crear un componente de prueba en `src/App.tsx`:**
```tsx
function App() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Setup Completo! ✅</h2>
          <p>TailwindCSS + DaisyUI funcionando</p>
          <div className="badge badge-primary">Primary</div>
          <div className="badge badge-secondary">Secondary</div>
          <button className="btn btn-primary">Test Button</button>
        </div>
      </div>
    </div>
  );
}

export default App;
```

**Ejecutar el servidor de desarrollo:**
```bash
npm run dev
```

**Verificar en el navegador:**
- Abrir http://localhost:5173
- Debe verse un card con estilos de DaisyUI
- Verificar que los colores y botones se rendericen correctamente

---

## 📝 Checklist de Completitud

- [ ] Proyecto Vite creado con template React-TS
- [ ] TailwindCSS + DaisyUI instalado y configurado
- [ ] Todas las dependencias instaladas (react-router-dom, axios, chart.js, etc.)
- [ ] ESLint + Prettier configurados
- [ ] Variables de entorno configuradas (.env, .env.example)
- [ ] Estructura de carpetas completa creada
- [ ] Path aliases configurados (vite.config.ts + tsconfig.json)
- [ ] Scripts de npm configurados
- [ ] Servidor de desarrollo funcionando (npm run dev)
- [ ] Estilos de DaisyUI renderizando correctamente
- [ ] Git configurado (.gitignore actualizado)

---

## 🎯 Resultado Esperado

Al finalizar esta fase debes tener:

✅ Proyecto React + TypeScript ejecutándose en http://localhost:5173  
✅ DaisyUI funcionando con temas personalizados  
✅ Estructura de carpetas completa y organizada  
✅ Herramientas de desarrollo configuradas  
✅ Sistema de imports con aliases funcionando  

---

## 🚀 Siguiente Fase

**FASE 2: TypeScript Types y API Configuration**

