# 🏥 Coach de Salud Personalizado - API Completa

## ✅ Estado: **FUNCIONANDO CORRECTAMENTE**

**Servidor ejecutándose en:** `http://localhost:3002`  
**Firebase Project:** `desafio-salud-valpo`  
**Base de datos:** Conectada y operacional  

---

## 📊 Endpoints del Coach de Salud

### 1. **Dashboard Personalizado Completo**
```http
GET /api/coach/dashboard/{userId}
```

**Ejemplo:**
```bash
curl http://localhost:3002/api/coach/dashboard/user123
```

**Respuesta:** Dashboard completo con:
- ✅ Información del usuario
- ✅ Métricas de salud (IMC, peso ideal, calorías)
- ✅ Recomendaciones personalizadas
- ✅ Objetivos de peso
- ✅ Consejos personalizados con IA

### 2. **Métricas de Salud de Usuario**
```http
GET /api/coach/metrics/{userId}
```

**Ejemplo:**
```bash
curl http://localhost:3002/api/coach/metrics/user123
```

**Respuesta:** Solo las métricas calculadas:
- IMC y categoría
- Peso ideal vs actual
- Metabolismo basal
- Calorías diarias recomendadas

### 3. **Lista de Todos los Usuarios**
```http
GET /api/coach/users
```

**Respuesta:** Array con todos los usuarios disponibles

### 4. **Resumen General de Usuarios**
```http
GET /api/coach/overview
```

**Respuesta:** Estadísticas generales:
- Total de usuarios
- Edad promedio
- IMC promedio
- Distribución de categorías de salud

### 5. **Información Básica de Usuario**
```http
GET /api/coach/user/{userId}
```

**Respuesta:** Solo datos básicos del usuario

### 6. **Test de Conexión Firebase**
```http
GET /api/coach/test-firebase
```

**Respuesta:** Estado de la conexión con Firebase

---

## 🧠 Endpoints del Sistema RAG (Inteligencia Artificial)

### 1. **RAG General**
```http
POST /api/ai/rag
Content-Type: application/json

{
  "question": "¿Qué ejercicios son buenos para el corazón?"
}
```

### 2. **RAG Médico Personalizado**
```http
POST /api/ai/health-rag
Content-Type: application/json

{
  "question": "¿Qué ejercicios puedo hacer con mi condición?",
  "patientContext": {
    "age": 35,
    "gender": "masculino",
    "medicalHistory": ["diabetes tipo 2"],
    "medications": ["metformina"]
  }
}
```

---

## 📋 Ejemplo de Respuesta Completa del Dashboard

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "user123",
      "nombre": "Juan Pérez",
      "edad": 35,
      "altura": 165,
      "peso": 80
    },
    "metricas": {
      "imc": 29.41,
      "imcCategory": "Sobrepeso",
      "pesoIdeal": 61.25,
      "diferenciaPeso": 18.75,
      "metabolismoBasal": 1635,
      "caloriasDiarias": 2289,
      "evaluacion": "Tienes sobrepeso leve. Con pequeños cambios puedes alcanzar tu peso ideal."
    },
    "recomendaciones": [
      {
        "categoria": "Ejercicio",
        "titulo": "Incrementa tu actividad física",
        "descripcion": "Combina ejercicio cardiovascular (30 min, 3 veces/semana) con entrenamiento de fuerza.",
        "prioridad": "alta",
        "tipo": "ejercicio",
        "icono": "🏃‍♂️"
      },
      {
        "categoria": "Nutrición",
        "titulo": "Control de porciones",
        "descripcion": "Reduce las porciones en un 20% y aumenta el consumo de vegetales y fibra.",
        "prioridad": "alta",
        "tipo": "nutricion",
        "icono": "🥗"
      }
    ],
    "objetivos": {
      "pesoObjetivo": 68.75,
      "semanasParaObjetivo": 23,
      "cambioSemanal": 0.5
    },
    "consejos": {
      "ejercicio": "Realiza ejercicio cardiovascular como caminar rápido o nadar 30 minutos, 5 días a la semana...",
      "nutricion": "Consume 2289 calorías diarias distribuidas en 5 comidas. Prioriza proteínas magras...",
      "hidratacion": "Bebe 2.8 litros de agua diarios. Aumenta durante ejercicio.",
      "sueno": "A los 35 años necesitas 7-8 horas de sueño. Mantén horarios regulares."
    },
    "timestamp": "2025-11-07T09:00:00.000Z"
  }
}
```

---

## 🎯 Integración en tu Frontend

### 1. **Crear el Cliente API**

```typescript
// utils/coachClient.ts
export class CoachClient {
  private baseURL = 'http://localhost:3002/api/coach';

  async getDashboard(userId: string) {
    const response = await fetch(`${this.baseURL}/dashboard/${userId}`);
    return response.json();
  }

  async getUserMetrics(userId: string) {
    const response = await fetch(`${this.baseURL}/metrics/${userId}`);
    return response.json();
  }

  async getAllUsers() {
    const response = await fetch(`${this.baseURL}/users`);
    return response.json();
  }
}

export const coachClient = new CoachClient();
```

### 2. **Hook React para el Dashboard**

```typescript
// hooks/useHealthDashboard.ts
import { useState, useEffect } from 'react';
import { coachClient } from '../utils/coachClient';

export const useHealthDashboard = (userId: string) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await coachClient.getDashboard(userId);
        if (result.success) {
          setDashboardData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Error cargando dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboard();
    }
  }, [userId]);

  return { dashboardData, loading, error };
};
```

### 3. **Componente Dashboard**

```typescript
// components/HealthDashboard.tsx
import { useHealthDashboard } from '../hooks/useHealthDashboard';

export const HealthDashboard = ({ userId }: { userId: string }) => {
  const { dashboardData, loading, error } = useHealthDashboard(userId);

  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return <div>No hay datos disponibles</div>;

  const { usuario, metricas, recomendaciones, objetivos, consejos } = dashboardData;

  return (
    <div className="health-dashboard">
      <h1>Dashboard de Salud - {usuario.nombre}</h1>
      
      {/* Métricas */}
      <section className="metrics">
        <h2>Tus Métricas</h2>
        <div className="metric-cards">
          <div className="card">
            <h3>IMC</h3>
            <span className="value">{metricas.imc}</span>
            <span className="category">{metricas.imcCategory}</span>
          </div>
          <div className="card">
            <h3>Peso Objetivo</h3>
            <span className="value">{objetivos.pesoObjetivo} kg</span>
            <span className="weeks">{objetivos.semanasParaObjetivo} semanas</span>
          </div>
          <div className="card">
            <h3>Calorías Diarias</h3>
            <span className="value">{metricas.caloriasDiarias}</span>
          </div>
        </div>
      </section>

      {/* Recomendaciones */}
      <section className="recommendations">
        <h2>Recomendaciones Personalizadas</h2>
        {recomendaciones.map((rec, index) => (
          <div key={index} className={`recommendation ${rec.prioridad}`}>
            <span className="icon">{rec.icono}</span>
            <div>
              <h3>{rec.titulo}</h3>
              <p>{rec.descripcion}</p>
              <span className="category">{rec.categoria}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Consejos */}
      <section className="advice">
        <h2>Consejos Personalizados</h2>
        <div className="advice-grid">
          <div className="advice-card">
            <h3>🏃‍♂️ Ejercicio</h3>
            <p>{consejos.ejercicio}</p>
          </div>
          <div className="advice-card">
            <h3>🥗 Nutrición</h3>
            <p>{consejos.nutricion}</p>
          </div>
          <div className="advice-card">
            <h3>💧 Hidratación</h3>
            <p>{consejos.hidratacion}</p>
          </div>
          <div className="advice-card">
            <h3>😴 Sueño</h3>
            <p>{consejos.sueno}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
```

---

## 🔧 Variables de Entorno para Frontend

```env
# .env.local (añadir a tu frontend)
NEXT_PUBLIC_COACH_API_URL=http://localhost:3002/api/coach
NEXT_PUBLIC_AI_API_URL=http://localhost:3002/api/ai
```

---

## 🚀 **¡TU COACH DE SALUD ESTÁ LISTO!**

### ✅ Funcionalidades implementadas:
- **Dashboard personalizado** con métricas de salud
- **Recomendaciones inteligentes** basadas en perfil del usuario  
- **Objetivos de peso** calculados automáticamente
- **Consejos personalizados** generados con IA
- **Integración Firebase** para datos reales de usuarios
- **Sistema RAG** para consultas médicas especializadas

### 📱 **¿Cómo usar en tu aplicación?**

1. **Usa los endpoints** para obtener el dashboard de cualquier usuario
2. **Integra los hooks React** en tus páginas existentes
3. **Personaliza el diseño** según tu UI/UX
4. **Conecta con tus usuarios reales** de Firebase

**¡El backend está completamente funcional y listo para integrar con tu frontend Next.js!** 🎉