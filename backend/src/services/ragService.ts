import { openaiService } from './openaiService';
import { DocumentChunk, RAGRequest, AIResponse, HealthRAGRequest } from '../types';

class RAGService {
  private documents: DocumentChunk[] = [];
  private healthKnowledgeBase: DocumentChunk[] = [];

  constructor() {
    // Inicializar con base de conocimientos médicos básica
    this.initializeHealthKnowledgeBase();
  }

  private initializeHealthKnowledgeBase(): void {
    this.healthKnowledgeBase = [
      {
        id: 'health_1',
        content: 'La hipertensión arterial es una condición crónica en la que la presión arterial está elevada. Se considera hipertensión cuando la presión sistólica es ≥140 mmHg o la diastólica es ≥90 mmHg. Es importante mantener una dieta baja en sodio, hacer ejercicio regular y tomar medicamentos según prescripción médica.',
        metadata: { source: 'medical_guidelines', type: 'cardiovascular', title: 'Hipertensión Arterial' }
      },
      {
        id: 'health_2',
        content: 'La diabetes tipo 2 es una enfermedad crónica que afecta la manera en que el cuerpo procesa el azúcar en sangre. El manejo incluye control de la dieta, ejercicio regular, monitoreo de glucosa y medicamentos. Los niveles normales de glucosa en ayunas deben estar entre 70-100 mg/dL.',
        metadata: { source: 'medical_guidelines', type: 'endocrine', title: 'Diabetes Tipo 2' }
      },
      {
        id: 'health_3',
        content: 'Los síntomas de alarma que requieren atención médica inmediata incluyen: dolor en el pecho, dificultad para respirar, dolor severo de cabeza, pérdida súbita de la visión o habla, fiebre alta persistente, y sangrado severo.',
        metadata: { source: 'emergency_guidelines', type: 'emergency', title: 'Síntomas de Alarma' }
      },
      {
        id: 'health_4',
        content: 'El ejercicio regular tiene múltiples beneficios para la salud: fortalece el corazón, mejora la circulación, ayuda a controlar el peso, reduce el estrés y mejora el estado de ánimo. Se recomienda al menos 150 minutos de actividad moderada por semana.',
        metadata: { source: 'wellness_guidelines', type: 'prevention', title: 'Beneficios del Ejercicio' }
      },
      {
        id: 'health_5',
        content: 'Una dieta balanceada debe incluir: frutas y verduras (5 porciones/día), proteínas magras, granos integrales, lácteos bajos en grasa, y limitar azúcares añadidos, sodio y grasas saturadas. La hidratación adecuada (8 vasos de agua/día) es esencial.',
        metadata: { source: 'nutrition_guidelines', type: 'nutrition', title: 'Alimentación Saludable' }
      }
    ];
  }

  // Simulación de búsqueda de documentos relevantes usando similaridad básica
  private async retrieveRelevantDocuments(
    question: string, 
    topK: number = 3,
    useHealthKB: boolean = false
  ): Promise<DocumentChunk[]> {
    const searchBase = useHealthKB ? this.healthKnowledgeBase : [...this.documents, ...this.healthKnowledgeBase];
    
    if (searchBase.length === 0) {
      return [];
    }

    // Simulación simple de búsqueda por palabras clave
    const questionLower = question.toLowerCase();
    const scored = searchBase.map(doc => {
      const contentLower = doc.content.toLowerCase();
      let score = 0;
      
      // Búsqueda por palabras clave relevantes
      const keywords = questionLower.split(' ').filter(word => word.length > 3);
      keywords.forEach(keyword => {
        const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        score += matches;
      });
      
      // Boost para documentos médicos si la pregunta parece médica
      if (this.isMedicalQuery(question) && doc.metadata?.type) {
        score += 2;
      }
      
      return { doc, score };
    });

    // Ordenar por relevancia y tomar los top K
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.doc);
  }

  private isMedicalQuery(query: string): boolean {
    const medicalKeywords = [
      'salud', 'enfermedad', 'síntoma', 'dolor', 'medicina', 'doctor', 'hospital',
      'tratamiento', 'diagnóstico', 'medicamento', 'presión', 'diabetes', 'fiebre',
      'sangre', 'corazón', 'respirar', 'cabeza', 'estómago', 'cuerpo'
    ];
    
    const queryLower = query.toLowerCase();
    return medicalKeywords.some(keyword => queryLower.includes(keyword));
  }

  async processRAGQuery(request: RAGRequest): Promise<AIResponse> {
    try {
      const { question, retrievalParams = {} } = request;
      const { topK = 3 } = retrievalParams;

      console.log(`Procesando consulta RAG: ${question}`);

      // 1. Recuperar documentos relevantes
      const relevantDocs = await this.retrieveRelevantDocuments(
        question, 
        topK, 
        this.isMedicalQuery(question)
      );

      if (relevantDocs.length === 0) {
        return {
          success: true,
          data: {
            response: "Lo siento, no encontré información específica sobre tu consulta en mi base de conocimientos. Te recomiendo consultar con un profesional médico para obtener información más precisa.",
            sources: []
          }
        };
      }

      // 2. Construir el contexto
      const context = relevantDocs
        .map((doc, index) => `Fuente ${index + 1}: ${doc.content}`)
        .join('\n\n');

      // 3. Construir el prompt RAG especializado en salud
      const ragPrompt = `Eres un asistente médico virtual que responde preguntas basándose en información médica confiable.

INSTRUCCIONES IMPORTANTES:
- Usa SOLO la información del contexto proporcionado para responder
- Si no encuentras la respuesta en el contexto, indícalo claramente
- Siempre recuerda que no reemplazas la consulta médica profesional
- Para emergencias o síntomas graves, recomienda buscar atención médica inmediata
- Sé preciso y conciso en tu respuesta

CONTEXTO MÉDICO:
${context}

PREGUNTA: ${question}

RESPUESTA:`;

      // 4. Generar respuesta con OpenAI
      const response = await openaiService.generateResponse({
        prompt: ragPrompt,
        parameters: {
          temperature: 0.3, // Más conservador para temas médicos
          maxTokens: 600,
          model: 'gpt-3.5-turbo'
        }
      });

      // 5. Añadir las fuentes utilizadas
      if (response.success && response.data) {
        response.data.sources = relevantDocs;
      }

      return response;
    } catch (error) {
      console.error('Error en RAG Service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en procesamiento RAG'
      };
    }
  }

  async processHealthRAGQuery(request: HealthRAGRequest): Promise<AIResponse> {
    try {
      const { question, patientContext, retrievalParams = {} } = request;
      const { topK = 4 } = retrievalParams;

      console.log(`Procesando consulta RAG de salud personalizada: ${question}`);

      // 1. Recuperar documentos relevantes de la base médica
      const relevantDocs = await this.retrieveRelevantDocuments(question, topK, true);

      // 2. Construir contexto personalizado
      const medicalContext = relevantDocs
        .map((doc, index) => `Información médica ${index + 1}: ${doc.content}`)
        .join('\n\n');

      const patientInfo = `
Información del paciente:
- Edad: ${patientContext.age} años
- Género: ${patientContext.gender}
- Historial médico: ${patientContext.medicalHistory?.join(', ') || 'No especificado'}
- Síntomas actuales: ${patientContext.currentSymptoms?.join(', ') || 'No especificado'}
- Medicamentos: ${patientContext.medications?.join(', ') || 'Ninguno'}
- Alergias: ${patientContext.allergies?.join(', ') || 'Ninguna conocida'}`;

      // 3. Prompt especializado con contexto del paciente
      const healthRAGPrompt = `Eres un asistente médico virtual especializado que proporciona información de salud personalizada.

INFORMACIÓN DEL PACIENTE:
${patientInfo}

CONOCIMIENTO MÉDICO RELEVANTE:
${medicalContext}

INSTRUCCIONES:
- Considera la información específica del paciente al responder
- Usa solo el conocimiento médico proporcionado
- Personaliza las recomendaciones según edad, género y condiciones
- SIEMPRE recuerda que esto no reemplaza la consulta médica profesional
- Para síntomas graves, recomienda atención médica inmediata

CONSULTA: ${question}

RESPUESTA PERSONALIZADA:`;

      // 4. Generar respuesta personalizada
      const response = await openaiService.generateResponse({
        prompt: healthRAGPrompt,
        parameters: {
          temperature: 0.2, // Muy conservador para consultas médicas personalizadas
          maxTokens: 700,
          model: 'gpt-3.5-turbo'
        }
      });

      // 5. Añadir fuentes y contexto del paciente
      if (response.success && response.data) {
        response.data.sources = relevantDocs;
      }

      return response;
    } catch (error) {
      console.error('Error en Health RAG Service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en procesamiento RAG de salud'
      };
    }
  }

  // Método para actualizar la base de conocimientos
  updateKnowledgeBase(documents: DocumentChunk[]): void {
    this.documents = documents;
    console.log(`Base de conocimientos actualizada con ${documents.length} documentos`);
  }

  // Método para añadir documentos médicos especializados
  addHealthDocuments(documents: DocumentChunk[]): void {
    const healthDocs = documents.map(doc => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        type: doc.metadata?.type || 'health',
        source: doc.metadata?.source || 'user_uploaded'
      }
    }));
    
    this.healthKnowledgeBase.push(...healthDocs);
    console.log(`Añadidos ${documents.length} documentos médicos a la base de conocimientos`);
  }

  // Método para obtener estadísticas
  getKnowledgeBaseStats() {
    return {
      totalDocuments: this.documents.length,
      healthDocuments: this.healthKnowledgeBase.length,
      totalChunks: this.documents.length + this.healthKnowledgeBase.length,
      categories: {
        general: this.documents.length,
        cardiovascular: this.healthKnowledgeBase.filter(d => d.metadata?.type === 'cardiovascular').length,
        endocrine: this.healthKnowledgeBase.filter(d => d.metadata?.type === 'endocrine').length,
        emergency: this.healthKnowledgeBase.filter(d => d.metadata?.type === 'emergency').length,
        prevention: this.healthKnowledgeBase.filter(d => d.metadata?.type === 'prevention').length,
        nutrition: this.healthKnowledgeBase.filter(d => d.metadata?.type === 'nutrition').length,
      }
    };
  }

  // Método para buscar por categoría médica
  getDocumentsByCategory(category: string): DocumentChunk[] {
    return this.healthKnowledgeBase.filter(doc => 
      doc.metadata?.type === category
    );
  }
}

export const ragService = new RAGService();