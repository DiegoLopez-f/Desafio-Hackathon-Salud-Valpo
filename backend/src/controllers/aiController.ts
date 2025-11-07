import { Request, Response } from 'express';
import { openaiService } from '../services/openaiService';
import { ragService } from '../services/ragService';
import { PromptRequest, RAGRequest, HealthRAGRequest } from '../types';

export class AIController {
  async generateResponse(req: Request, res: Response) {
    try {
      const promptRequest: PromptRequest = req.body;
      
      if (!promptRequest.prompt) {
        return res.status(400).json({
          success: false,
          error: 'El prompt es requerido'
        });
      }

      console.log('Generando respuesta simple con IA...');
      const result = await openaiService.generateResponse(promptRequest);
      
      res.json(result);
    } catch (error) {
      console.error('Error en generateResponse:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async processRAGQuery(req: Request, res: Response) {
    try {
      const ragRequest: RAGRequest = req.body;
      
      if (!ragRequest.question) {
        return res.status(400).json({
          success: false,
          error: 'La pregunta es requerida'
        });
      }

      console.log('Procesando consulta RAG...');
      const result = await ragService.processRAGQuery(ragRequest);
      
      res.json(result);
    } catch (error) {
      console.error('Error en processRAGQuery:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async processHealthRAGQuery(req: Request, res: Response) {
    try {
      const healthRAGRequest: HealthRAGRequest = req.body;
      
      if (!healthRAGRequest.question) {
        return res.status(400).json({
          success: false,
          error: 'La pregunta es requerida'
        });
      }

      if (!healthRAGRequest.patientContext) {
        return res.status(400).json({
          success: false,
          error: 'El contexto del paciente es requerido'
        });
      }

      console.log('Procesando consulta RAG de salud personalizada...');
      const result = await ragService.processHealthRAGQuery(healthRAGRequest);
      
      res.json(result);
    } catch (error) {
      console.error('Error en processHealthRAGQuery:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async updateKnowledgeBase(req: Request, res: Response) {
    try {
      const { documents } = req.body;
      
      if (!documents || !Array.isArray(documents)) {
        return res.status(400).json({
          success: false,
          error: 'Documentos inválidos. Se espera un array de documentos.'
        });
      }

      ragService.updateKnowledgeBase(documents);
      
      res.json({
        success: true,
        data: {
          message: 'Base de conocimientos actualizada exitosamente',
          stats: ragService.getKnowledgeBaseStats()
        }
      });
    } catch (error) {
      console.error('Error actualizando base de conocimientos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async addHealthDocuments(req: Request, res: Response) {
    try {
      const { documents } = req.body;
      
      if (!documents || !Array.isArray(documents)) {
        return res.status(400).json({
          success: false,
          error: 'Documentos médicos inválidos. Se espera un array de documentos.'
        });
      }

      ragService.addHealthDocuments(documents);
      
      res.json({
        success: true,
        data: {
          message: 'Documentos médicos añadidos exitosamente',
          stats: ragService.getKnowledgeBaseStats()
        }
      });
    } catch (error) {
      console.error('Error añadiendo documentos médicos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async getHealthCheck(req: Request, res: Response) {
    try {
      const stats = ragService.getKnowledgeBaseStats();
      
      res.json({
        success: true,
        data: {
          status: 'OK',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          stats,
          endpoints: {
            generate: '/api/ai/generate',
            rag: '/api/ai/rag',
            healthRag: '/api/ai/health-rag',
            knowledgeBase: '/api/ai/knowledge-base',
            healthDocuments: '/api/ai/health-documents'
          }
        }
      });
    } catch (error) {
      console.error('Error en health check:', error);
      res.status(500).json({
        success: false,
        error: 'Error en verificación de estado del sistema'
      });
    }
  }

  async getDocumentsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      
      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'La categoría es requerida'
        });
      }

      const documents = ragService.getDocumentsByCategory(category);
      
      res.json({
        success: true,
        data: {
          category,
          documents,
          count: documents.length
        }
      });
    } catch (error) {
      console.error('Error obteniendo documentos por categoría:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  async generateHealthResponse(req: Request, res: Response) {
    try {
      const { prompt, patientContext } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'El prompt es requerido'
        });
      }

      console.log('Generando respuesta médica especializada...');
      const result = await openaiService.generateHealthResponse(prompt, patientContext);
      
      res.json(result);
    } catch (error) {
      console.error('Error en generateHealthResponse:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

export const aiController = new AIController();