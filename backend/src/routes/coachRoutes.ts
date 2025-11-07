import { Router } from 'express';
import { healthCoachController } from '../controllers/healthCoachController';

const router = Router();

// 🏠 Dashboard personalizado completo para un usuario
router.get('/dashboard/:userId', healthCoachController.getPersonalizedDashboard);

// 📊 Solo métricas de salud de un usuario
router.get('/metrics/:userId', healthCoachController.getUserHealthMetrics);

// 👤 Información básica de un usuario
router.get('/user/:userId', healthCoachController.getUserInfo);

// 👥 Lista de todos los usuarios
router.get('/users', healthCoachController.getAllUsers);

// 📈 Resumen general de todos los usuarios
router.get('/overview', healthCoachController.getUsersOverview);

// 🔧 Test de conexión Firebase
router.get('/test-firebase', healthCoachController.testFirebaseConnection);

export { router as coachRoutes };