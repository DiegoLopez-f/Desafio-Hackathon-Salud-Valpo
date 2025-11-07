import { Request, Response } from 'express';
import { healthCoachService } from '../services/healthCoachService';
import { firebaseService } from '../services/firebaseService';

export class HealthCoachController {
  // Obtener recomendaciones personalizadas para un usuario
  async getPersonalizedDashboard(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID de usuario es requerido'
        });
      }

      console.log(`📊 Generando dashboard personalizado para usuario: ${userId}`);
      
      const dashboardData = await healthCoachService.getPersonalizedRecommendations(userId);
      
      if (!dashboardData) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          ...dashboardData,
          timestamp: new Date().toISOString(),
          message: `Dashboard personalizado generado para ${dashboardData.usuario.nombre}`
        }
      });
    } catch (error) {
      console.error('Error generando dashboard personalizado:', error);
      res.status(500).json({
        success: false,
        error: 'Error generando recomendaciones personalizadas'
      });
    }
  }

  // Obtener solo las métricas de salud de un usuario
  async getUserHealthMetrics(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID de usuario es requerido'
        });
      }

      const userData = await firebaseService.getUserById(userId);
      
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      const metricas = firebaseService.calculateHealthMetrics(userData);

      res.json({
        success: true,
        data: {
          usuario: userData,
          metricas,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error obteniendo métricas de usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo métricas de salud'
      });
    }
  }

  // Obtener resumen general de todos los usuarios
  async getUsersOverview(req: Request, res: Response) {
    try {
      console.log('📈 Generando resumen general de usuarios');
      
      const overview = await healthCoachService.getUsersOverview();

      res.json({
        success: true,
        data: {
          ...overview,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generando resumen de usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error generando resumen de usuarios'
      });
    }
  }

  // Obtener información de un usuario específico
  async getUserInfo(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID de usuario es requerido'
        });
      }

      const userData = await firebaseService.getUserById(userId);
      
      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          usuario: userData,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error obteniendo información de usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo información del usuario'
      });
    }
  }

  // Listar todos los usuarios disponibles
  async getAllUsers(req: Request, res: Response) {
    try {
      console.log('👥 Obteniendo lista de todos los usuarios');
      
      const users = await firebaseService.getAllUsers();

      res.json({
        success: true,
        data: {
          users,
          totalUsers: users.length,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error obteniendo lista de usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo lista de usuarios'
      });
    }
  }

  // Endpoint para probar la conexión con Firebase
  async testFirebaseConnection(req: Request, res: Response) {
    try {
      console.log('🔧 Probando conexión con Firebase');
      
      // Intentar obtener un usuario de prueba
      const testUser = await firebaseService.getUserById('user123');
      
      res.json({
        success: true,
        data: {
          firebaseConnected: true,
          testUser: testUser || null,
          message: testUser ? 
            'Conexión Firebase exitosa - usuario de prueba encontrado' : 
            'Firebase conectado pero usuario de prueba no encontrado',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error probando conexión Firebase:', error);
      res.status(500).json({
        success: false,
        error: 'Error conectando con Firebase',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export const healthCoachController = new HealthCoachController();