import OpenAI from 'openai';
import { config } from '../config';
import { PromptRequest, AIResponse } from '../types';

class OpenAIService {
  private client: OpenAI;

  constructor() {
    console.log('Inicializando OpenAI Service...');
    
    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
    });
    
    console.log('✅ OpenAI Service inicializado correctamente');
  }

  async generateResponse(request: PromptRequest): Promise<AIResponse> {
    try {
      const { prompt, parameters = {} } = request;
      
      console.log('Generando respuesta con OpenAI...');
      
      const completion = await this.client.chat.completions.create({
        model: parameters.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente de salud especializado en proporcionar información médica precisa y útil. Siempre recuerda que no reemplazas la consulta médica profesional.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: parameters.temperature || 0.7,
        max_tokens: parameters.maxTokens || 1000,
      });

      const response = completion.choices[0]?.message?.content || '';

      return {
        success: true,
        data: {
          response,
          usage: {
            promptTokens: completion.usage?.prompt_tokens || 0,
            completionTokens: completion.usage?.completion_tokens || 0,
            totalTokens: completion.usage?.total_tokens || 0,
          }
        }
      };
    } catch (error) {
      console.error('Error en OpenAI Service:', error);
      
      if (error instanceof OpenAI.APIError) {
        return {
          success: false,
          error: `Error de OpenAI: ${error.message}`
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en OpenAI'
      };
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      console.log(`Generando embeddings para ${texts.length} textos...`);
      
      const response = await this.client.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texts,
      });

      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error generando embeddings:', error);
      throw error;
    }
  }

  async generateHealthResponse(prompt: string, patientContext?: any): Promise<AIResponse> {
    try {
      const systemPrompt = `Eres un asistente médico virtual especializado en salud. 
      Proporciona información médica precisa basada en evidencia científica.
      
      IMPORTANTE: 
      - Siempre recuerda que no reemplazas la consulta médica profesional
      - Para síntomas graves o emergencias, recomienda buscar atención médica inmediata
      - Limita tus respuestas a información general de salud
      - No hagas diagnósticos específicos
      
      ${patientContext ? `Contexto del paciente: ${JSON.stringify(patientContext)}` : ''}`;

      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Más conservador para temas médicos
        max_tokens: 800,
      });

      const response = completion.choices[0]?.message?.content || '';

      return {
        success: true,
        data: {
          response,
          usage: {
            promptTokens: completion.usage?.prompt_tokens || 0,
            completionTokens: completion.usage?.completion_tokens || 0,
            totalTokens: completion.usage?.total_tokens || 0,
          }
        }
      };
    } catch (error) {
      console.error('Error en generateHealthResponse:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error generando respuesta de salud'
      };
    }
  }
}

export const openaiService = new OpenAIService();