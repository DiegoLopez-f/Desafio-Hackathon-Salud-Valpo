# Backend de Agente de IA para Salud

Este backend implementa un sistema RAG (Retrieval-Augmented Generation) especializado en consultas de salud usando OpenAI GPT.

## 🚀 Características

- **Sistema RAG personalizado** para consultas médicas
- **Base de conocimientos médicos** integrada
- **Respuestas contextualizadas** basadas en información del paciente
- **API RESTful** con múltiples endpoints especializados
- **Manejo seguro** de información médica
- **Integración con OpenAI** GPT-3.5-turbo

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- API Key de OpenAI

## 🛠️ Instalación

1. **Navegar al directorio del backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

4. **Editar el archivo .env con tus credenciales:**
   ```env
   OPENAI_API_KEY=tu_clave_de_openai_aqui
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

5. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```

6. **Construir para producción:**
   ```bash
   npm run build
   npm start
   ```

## 📚 Endpoints de la API

### Salud y Estado
- `GET /` - Información general de la API
- `GET /api/ai/health` - Estado del sistema y estadísticas

### Generación de Respuestas
- `POST /api/ai/generate` - Generación simple con IA
- `POST /api/ai/health-generate` - Respuestas médicas especializadas

### Sistema RAG
- `POST /api/ai/rag` - Consultas RAG generales
- `POST /api/ai/health-rag` - Consultas RAG médicas personalizadas

### Base de Conocimientos
- `POST /api/ai/knowledge-base` - Actualizar base de conocimientos
- `POST /api/ai/health-documents` - Añadir documentos médicos
- `GET /api/ai/categories/:category` - Documentos por categoría

## 🔧 Uso de la API

### Consulta RAG de Salud Personalizada

```javascript
const response = await fetch('http://localhost:3001/api/ai/health-rag', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: "¿Qué ejercicios puedo hacer con mi condición?",
    patientContext: {
      age: 45,
      gender: "masculino",
      medicalHistory: ["diabetes tipo 2", "hipertensión"],
      currentSymptoms: [],
      medications: ["metformina", "lisinopril"],
      allergies: []
    },
    retrievalParams: {
      topK: 3
    }
  })
});

const data = await response.json();
console.log(data.data.response);
```

### Generación Simple

```javascript
const response = await fetch('http://localhost:3001/api/ai/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: "Explícame qué es la hipertensión",
    parameters: {
      temperature: 0.7,
      maxTokens: 500
    }
  })
});
```

### Actualizar Base de Conocimientos

```javascript
const response = await fetch('http://localhost:3001/api/ai/health-documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    documents: [
      {
        content: "La nueva información médica que quieres añadir...",
        metadata: {
          source: "manual_medico",
          type: "cardiovascular",
          title: "Nuevo Tratamiento Hipertensión"
        }
      }
    ]
  })
});
```

## 🏗️ Arquitectura

```
backend/
├── src/
│   ├── app.ts              # Aplicación principal
│   ├── controllers/        # Controladores de la API
│   │   └── aiController.ts
│   ├── services/          # Lógica de negocio
│   │   ├── openaiService.ts
│   │   └── ragService.ts
│   ├── routes/            # Definición de rutas
│   │   └── aiRoutes.ts
│   ├── middleware/        # Middleware personalizado
│   │   └── errorHandler.ts
│   └── types/            # Definiciones de tipos TypeScript
│       └── index.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔒 Seguridad

- **Helmet** para headers de seguridad
- **CORS** configurado específicamente para el frontend
- **Validación** de entrada en todos los endpoints
- **Manejo seguro** de errores sin exposer información sensible
- **Rate limiting** (recomendado para producción)

## 🧪 Base de Conocimientos Médicos

El sistema incluye una base de conocimientos médicos inicial con información sobre:

- **Enfermedades cardiovasculares** (hipertensión, etc.)
- **Diabetes y endocrinología**
- **Síntomas de alarma y emergencias**
- **Prevención y ejercicio**
- **Nutrición y alimentación saludable**

## 🚨 Advertencias Importantes

- **No es un sustituto médico**: Este sistema proporciona información general de salud
- **Consulta profesional**: Siempre recomienda consultar con profesionales médicos
- **Emergencias**: Para síntomas graves, dirige a atención médica inmediata
- **Validación**: Toda información debe ser validada por profesionales

## 🔄 Integración con Frontend

Para usar desde tu frontend Next.js:

```typescript
// utils/api.ts
const API_BASE_URL = 'http://localhost:3001/api/ai';

export const aiAPI = {
  async consultarSalud(pregunta: string, contextoUsuario: any) {
    const response = await fetch(`${API_BASE_URL}/health-rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: pregunta,
        patientContext: contextoUsuario
      })
    });
    return response.json();
  }
};
```

## 📈 Próximas Características

- Integración con bases de datos vectoriales (ChromaDB, Pinecone)
- Autenticación y autorización
- Logging avanzado
- Métricas y monitoreo
- Cache de respuestas
- Procesamiento de documentos médicos (PDF, DOC)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request