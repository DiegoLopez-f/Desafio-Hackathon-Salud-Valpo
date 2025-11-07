import { config } from './config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { aiRoutes } from './routes/aiRoutes';
import { coachRoutes } from './routes/coachRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = config.port;

// Middleware de seguridad
app.use(helmet());

// CORS configurado para el frontend
app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Coach de Salud con IA - Funcionando correctamente',
    version: '2.0.0',
    features: {
      ai: 'Sistema RAG con OpenAI',
      firebase: 'Integración con base de datos de usuarios',
      coach: 'Recomendaciones personalizadas de salud',
      dashboard: 'Métricas y análisis de salud'
    },
    endpoints: {
      // Endpoints de IA RAG
      aiHealth: '/api/ai/health',
      aiGenerate: '/api/ai/generate',
      aiRag: '/api/ai/rag',
      aiHealthRag: '/api/ai/health-rag',
      
      // Endpoints del Coach de Salud
      coachDashboard: '/api/coach/dashboard/:userId',
      coachMetrics: '/api/coach/metrics/:userId',
      coachUsers: '/api/coach/users',
      coachOverview: '/api/coach/overview',
      coachTest: '/api/coach/test-firebase'
    },
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/ai', aiRoutes);
app.use('/api/coach', coachRoutes);

// Middleware de manejo de rutas no encontradas
app.use('*', notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de IA para Salud ejecutándose en puerto ${PORT}`);
  console.log(`📋 Documentación disponible en: http://localhost:${PORT}`);
  console.log(`🔗 Frontend URL configurada: ${config.frontendUrl}`);
  console.log('🎯 Sistema RAG médico listo para consultas');
});

export default app;