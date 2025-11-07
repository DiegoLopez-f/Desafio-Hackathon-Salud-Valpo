# Ejemplo de Integración Frontend - Backend

## Cliente API para el Frontend

Este es un ejemplo de cómo integrar el backend RAG en tu frontend Next.js:

```typescript
// utils/aiClient.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/ai';

export interface PatientContext {
  age: number;
  gender: string;
  medicalHistory?: string[];
  currentSymptoms?: string[];
  medications?: string[];
  allergies?: string[];
}

export interface ConsultaRAG {
  question: string;
  patientContext?: PatientContext;
}

export class AIClient {
  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en solicitud AI:', error);
      throw error;
    }
  }

  // Consulta RAG general
  async consultarRAG(question: string) {
    return this.makeRequest('/rag', { question });
  }

  // Consulta RAG médica personalizada
  async consultarSaludPersonalizada(consulta: ConsultaRAG) {
    return this.makeRequest('/health-rag', {
      question: consulta.question,
      patientContext: consulta.patientContext
    });
  }

  // Generar respuesta médica simple
  async generarRespuestaSalud(prompt: string, patientContext?: PatientContext) {
    return this.makeRequest('/health-generate', {
      prompt,
      patientContext
    });
  }

  // Verificar estado del sistema
  async verificarEstado() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export const aiClient = new AIClient();
```

## Componente React de Ejemplo

```typescript
// components/ConsultorSalud.tsx
import React, { useState } from 'react';
import { aiClient, PatientContext } from '../utils/aiClient';

interface ConsultorSaludProps {
  patientContext?: PatientContext;
}

export const ConsultorSalud: React.FC<ConsultorSaludProps> = ({ patientContext }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsulta = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (patientContext) {
        // Usar RAG personalizado si hay contexto del paciente
        result = await aiClient.consultarSaludPersonalizada({
          question,
          patientContext
        });
      } else {
        // Usar RAG general
        result = await aiClient.consultarRAG(question);
      }

      if (result.success) {
        setResponse(result.data.response);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="consultor-salud">
      <div className="consulta-form">
        <h3>Consultor de Salud IA</h3>
        
        {patientContext && (
          <div className="patient-context">
            <p><strong>Paciente:</strong> {patientContext.gender}, {patientContext.age} años</p>
            {patientContext.medicalHistory && (
              <p><strong>Historial:</strong> {patientContext.medicalHistory.join(', ')}</p>
            )}
          </div>
        )}

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu consulta médica aquí..."
          rows={4}
          cols={50}
        />
        
        <button 
          onClick={handleConsulta} 
          disabled={loading || !question.trim()}
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {response && (
        <div className="response">
          <h4>Respuesta:</h4>
          <div className="response-content">
            {response}
          </div>
          <div className="disclaimer">
            <small>
              ⚠️ Esta información es solo educativa. Consulta a un profesional médico 
              para diagnósticos y tratamientos específicos.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};
```

## Hook personalizado para usar en tu aplicación

```typescript
// hooks/useAIConsultor.ts
import { useState, useCallback } from 'react';
import { aiClient, PatientContext } from '../utils/aiClient';

export const useAIConsultor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const consultarSalud = useCallback(async (
    question: string, 
    patientContext?: PatientContext
  ) => {
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (patientContext) {
        result = await aiClient.consultarSaludPersonalizada({
          question,
          patientContext
        });
      } else {
        result = await aiClient.consultarRAG(question);
      }

      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Error desconocido');
        return null;
      }
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarEstado = useCallback(async () => {
    try {
      return await aiClient.verificarEstado();
    } catch (err) {
      console.error('Error verificando estado:', err);
      return null;
    }
  }, []);

  return {
    consultarSalud,
    verificarEstado,
    loading,
    error,
    clearError: () => setError('')
  };
};
```

## Uso en una página de tu aplicación

```typescript
// pages/consultor.tsx o app/consultor/page.tsx
import React, { useState } from 'react';
import { ConsultorSalud } from '../components/ConsultorSalud';
import { PatientContext } from '../utils/aiClient';

export default function ConsultorPage() {
  const [patientContext, setPatientContext] = useState<PatientContext>({
    age: 35,
    gender: 'femenino',
    medicalHistory: ['diabetes tipo 2'],
    medications: ['metformina'],
    allergies: []
  });

  return (
    <div className="consultor-page">
      <h1>Consultor de Salud con IA</h1>
      
      <div className="patient-form">
        {/* Aquí puedes agregar formularios para actualizar patientContext */}
      </div>

      <ConsultorSalud patientContext={patientContext} />
    </div>
  );
}
```

## Variables de entorno para el Frontend

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/ai
```

## Ejemplos de consultas que puedes probar:

1. **RAG General:**
   - "¿Qué es la diabetes tipo 2?"
   - "¿Cuáles son los síntomas de la hipertensión?"
   - "¿Qué ejercicios son buenos para el corazón?"

2. **RAG Personalizado:**
   ```json
   {
     "question": "¿Qué ejercicios puedo hacer con mi condición?",
     "patientContext": {
       "age": 45,
       "gender": "masculino",
       "medicalHistory": ["diabetes tipo 2", "hipertensión"],
       "medications": ["metformina", "lisinopril"]
     }
   }
   ```

3. **Consultas de emergencia:**
   - "Tengo dolor en el pecho, ¿qué debo hacer?"
   - "¿Cuándo debo ir al hospital?"

El sistema reconocerá automáticamente situaciones que requieren atención médica inmediata y recomendará buscar ayuda profesional.