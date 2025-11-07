export interface PromptRequest {
  prompt: string;
  context?: string;
  parameters?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  };
}

export interface AIResponse {
  success: boolean;
  data?: {
    response: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    sources?: DocumentChunk[];
  };
  error?: string;
}

export interface DocumentChunk {
  id?: string;
  content: string;
  metadata?: {
    source?: string;
    page?: number;
    chunk_id?: string;
    title?: string;
    type?: string;
  };
}

export interface RAGRequest {
  question: string;
  documents?: DocumentChunk[];
  retrievalParams?: {
    topK?: number;
    similarityThreshold?: number;
  };
  healthContext?: {
    age?: number;
    gender?: string;
    conditions?: string[];
    medications?: string[];
  };
}

export interface HealthRAGRequest extends RAGRequest {
  patientContext: {
    age: number;
    gender: string;
    medicalHistory?: string[];
    currentSymptoms?: string[];
    medications?: string[];
    allergies?: string[];
  };
}

export interface EmbeddingRequest {
  texts: string[];
}

export interface EmbeddingResponse {
  success: boolean;
  data?: {
    embeddings: number[][];
  };
  error?: string;
}

// Tipos para el sistema de Firebase y Coach de Salud
export interface UserData {
  id: string;
  nombre: string;
  edad: number;
  altura: number; // en cm
  peso: number;   // en kg
}

export interface HealthMetrics {
  imc: number;
  imcCategory: string;
  pesoIdeal: number;
  diferenciaPeso: number;
  metabolismoBasal: number;
  caloriasDiarias: number;
  evaluacion: string;
}

export interface CoachRecommendation {
  categoria: string;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  tipo: 'ejercicio' | 'nutricion' | 'habitos' | 'salud';
  icono: string;
}

export interface DashboardData {
  usuario: UserData;
  metricas: HealthMetrics;
  recomendaciones: CoachRecommendation[];
  objetivos: {
    pesoObjetivo: number;
    semanasParaObjetivo: number;
    cambioSemanal: number;
  };
  consejos: {
    ejercicio: string;
    nutricion: string;
    hidratacion: string;
    sueno: string;
  };
}

export interface UsersOverview {
  totalUsers: number;
  averageAge: number;
  averageIMC: number;
  healthDistribution: Record<string, number>;
}