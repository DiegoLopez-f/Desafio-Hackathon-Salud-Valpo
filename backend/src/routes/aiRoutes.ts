import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

// Endpoint para generar respuestas simples con IA
router.post('/generate', aiController.generateResponse);

// Endpoint para generar respuestas médicas especializadas
router.post('/health-generate', aiController.generateHealthResponse);

// Endpoint para consultas RAG generales
router.post('/rag', aiController.processRAGQuery);

// Endpoint para consultas RAG de salud personalizadas
router.post('/health-rag', aiController.processHealthRAGQuery);

// Endpoint para actualizar base de conocimientos general
router.post('/knowledge-base', aiController.updateKnowledgeBase);

// Endpoint para añadir documentos médicos especializados
router.post('/health-documents', aiController.addHealthDocuments);

// Endpoint para obtener documentos por categoría médica
router.get('/categories/:category', aiController.getDocumentsByCategory);

// Health check del sistema
router.get('/health', aiController.getHealthCheck);

export { router as aiRoutes };