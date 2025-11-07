import { firebaseService } from './firebaseService';
import { ragService } from './ragService';
import { openaiService } from './openaiService';

interface UserData {
  id: string;
  nombre: string;
  edad: number;
  altura: number;
  peso: number;
}

interface HealthMetrics {
  imc: number;
  imcCategory: string;
  pesoIdeal: number;
  diferenciaPeso: number;
  metabolismoBasal: number;
  caloriasDiarias: number;
  evaluacion: string;
}

interface CoachRecommendation {
  categoria: string;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  tipo: 'ejercicio' | 'nutricion' | 'habitos' | 'salud';
  icono: string;
}

interface DashboardData {
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

class HealthCoachService {
  async getPersonalizedRecommendations(userId: string): Promise<DashboardData | null> {
    try {
      console.log(`🏥 Generando recomendaciones personalizadas para usuario: ${userId}`);
      
      // 1. Obtener datos del usuario desde Firebase
      console.log('📋 Paso 1: Obteniendo datos del usuario...');
      const userData = await firebaseService.getUserById(userId);
      if (!userData) {
        console.error(`❌ Usuario ${userId} no encontrado`);
        throw new Error('Usuario no encontrado');
      }
      console.log('✅ Usuario encontrado:', userData.nombre);

      // 2. Calcular métricas de salud
      console.log('📊 Paso 2: Calculando métricas de salud...');
      const metricas = firebaseService.calculateHealthMetrics(userData);
      console.log('✅ Métricas calculadas - IMC:', metricas.imc);

      // 3. Generar recomendaciones personalizadas
      console.log('🎯 Paso 3: Generando recomendaciones...');
      const recomendaciones = this.generateRecommendations(userData, metricas);
      console.log('✅ Recomendaciones generadas:', recomendaciones.length);

      // 4. Calcular objetivos personalizados
      console.log('🎯 Paso 4: Calculando objetivos...');
      const objetivos = this.calculateGoals(userData, metricas);
      console.log('✅ Objetivos calculados - Peso objetivo:', objetivos.pesoObjetivo);

      // 5. Generar consejos personalizados
      console.log('💡 Paso 5: Generando consejos personalizados...');
      const consejos = await this.generatePersonalizedAdvice(userData, metricas);
      console.log('✅ Consejos generados');

      console.log('🎉 Dashboard completado exitosamente');
      return {
        usuario: userData,
        metricas,
        recomendaciones,
        objetivos,
        consejos
      };
    } catch (error) {
      console.error('❌ Error generando recomendaciones:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  private generateRecommendations(userData: UserData, metricas: HealthMetrics): CoachRecommendation[] {
    const recomendaciones: CoachRecommendation[] = [];
    const { imc, imcCategory, diferenciaPeso } = metricas;
    const { edad } = userData;

    // Recomendaciones basadas en IMC
    if (imc < 18.5) {
      recomendaciones.push({
        categoria: 'Nutrición',
        titulo: 'Aumenta tu ingesta calórica',
        descripcion: 'Incluye más proteínas y carbohidratos complejos en tus comidas. Considera frutos secos y aguacates.',
        prioridad: 'alta',
        tipo: 'nutricion',
        icono: '🥑'
      });
    } else if (imc >= 25) {
      recomendaciones.push({
        categoria: 'Ejercicio',
        titulo: 'Incrementa tu actividad física',
        descripcion: 'Combina ejercicio cardiovascular (30 min, 3 veces/semana) con entrenamiento de fuerza.',
        prioridad: 'alta',
        tipo: 'ejercicio',
        icono: '🏃‍♂️'
      });
      
      recomendaciones.push({
        categoria: 'Nutrición',
        titulo: 'Control de porciones',
        descripcion: 'Reduce las porciones en un 20% y aumenta el consumo de vegetales y fibra.',
        prioridad: 'alta',
        tipo: 'nutricion',
        icono: '🥗'
      });
    }

    // Recomendaciones por edad
    if (edad >= 40) {
      recomendaciones.push({
        categoria: 'Salud',
        titulo: 'Chequeos médicos regulares',
        descripcion: 'A partir de los 40, es importante realizar chequeos médicos anuales y exámenes preventivos.',
        prioridad: 'media',
        tipo: 'salud',
        icono: '🩺'
      });
    }

    // Recomendaciones universales
    recomendaciones.push(
      {
        categoria: 'Hidratación',
        titulo: 'Mantén una hidratación óptima',
        descripcion: 'Bebe al menos 2.5 litros de agua al día. Aumenta en días de ejercicio o calor.',
        prioridad: 'media',
        tipo: 'habitos',
        icono: '💧'
      },
      {
        categoria: 'Sueño',
        titulo: 'Optimiza tu descanso',
        descripcion: 'Mantén un horario regular de sueño de 7-8 horas. Evita pantallas 1 hora antes de dormir.',
        prioridad: 'media',
        tipo: 'habitos',
        icono: '😴'
      },
      {
        categoria: 'Ejercicio',
        titulo: 'Camina más durante el día',
        descripcion: 'Intenta caminar al menos 8,000 pasos diarios. Usa las escaleras en lugar del ascensor.',
        prioridad: 'baja',
        tipo: 'ejercicio',
        icono: '🚶‍♂️'
      }
    );

    return recomendaciones.sort((a, b) => {
      const prioridadOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
      return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
    });
  }

  private calculateGoals(userData: UserData, metricas: HealthMetrics) {
    const { peso } = userData;
    const { pesoIdeal, diferenciaPeso } = metricas;
    
    // Si ya está en peso ideal, mantener peso actual
    let pesoObjetivo = pesoIdeal;
    
    // Si tiene sobrepeso, objetivo intermedio más realista
    if (diferenciaPeso > 10) {
      pesoObjetivo = peso - (diferenciaPeso * 0.6); // 60% del exceso
    } else if (diferenciaPeso < -5) {
      pesoObjetivo = peso + Math.abs(diferenciaPeso) * 0.5; // 50% del déficit
    }
    
    // Cambio semanal saludable (0.5kg por semana máximo)
    const cambioSemanal = Math.min(Math.abs(peso - pesoObjetivo) / 12, 0.5);
    const semanasParaObjetivo = Math.ceil(Math.abs(peso - pesoObjetivo) / cambioSemanal);
    
    return {
      pesoObjetivo: Math.round(pesoObjetivo * 100) / 100,
      semanasParaObjetivo: Math.min(semanasParaObjetivo, 26), // Máximo 6 meses
      cambioSemanal: Math.round(cambioSemanal * 100) / 100
    };
  }

  private async generatePersonalizedAdvice(userData: UserData, metricas: HealthMetrics) {
    const { nombre, edad, peso, altura } = userData;
    const { imc, imcCategory, caloriasDiarias } = metricas;
    
    // Por ahora usar consejos predefinidos basados en datos del usuario
    // Para evitar errores con OpenAI en la demostración
    
    let ejercicioConsejo = 'Realiza 150 minutos de ejercicio moderado por semana.';
    let nutricionConsejo = 'Mantén una dieta balanceada con proteínas, carbohidratos y grasas saludables.';
    
    // Personalizar según IMC
    if (imc < 18.5) {
      ejercicioConsejo = 'Combina ejercicios de fuerza con cardio ligero. Enfócate en ganar masa muscular.';
      nutricionConsejo = `Aumenta tu ingesta calórica a ${caloriasDiarias + 300} calorías. Incluye proteínas y carbohidratos.`;
    } else if (imc >= 25) {
      ejercicioConsejo = 'Ejercicio cardiovascular 30 min/día + entrenamiento de fuerza 3 veces/semana.';
      nutricionConsejo = `Mantén ${Math.round(caloriasDiarias * 0.85)} calorías diarias. Aumenta vegetales y fibra.`;
    }
    
    // Personalizar según edad
    if (edad >= 50) {
      ejercicioConsejo += ' Incluye ejercicios de equilibrio y flexibilidad.';
    } else if (edad <= 30) {
      ejercicioConsejo += ' Puedes incluir entrenamientos de alta intensidad.';
    }

    return {
      ejercicio: ejercicioConsejo,
      nutricion: nutricionConsejo,
      hidratacion: `Bebe ${Math.round(peso * 0.035)} litros de agua diarios. Aumenta durante ejercicio y calor.`,
      sueno: `A los ${edad} años necesitas ${edad < 25 ? '8-9' : edad < 65 ? '7-8' : '7-8'} horas de sueño. Mantén horarios regulares.`
    };
  }

  async getUsersOverview(): Promise<{
    totalUsers: number;
    averageAge: number;
    averageIMC: number;
    healthDistribution: Record<string, number>;
  }> {
    try {
      const users = await firebaseService.getAllUsers();
      
      if (users.length === 0) {
        return {
          totalUsers: 0,
          averageAge: 0,
          averageIMC: 0,
          healthDistribution: {}
        };
      }

      const metricas = users.map(user => firebaseService.calculateHealthMetrics(user));
      
      const totalAge = users.reduce((sum, user) => sum + user.edad, 0);
      const totalIMC = metricas.reduce((sum, metrica) => sum + metrica.imc, 0);
      
      const healthDistribution: Record<string, number> = {};
      metricas.forEach(metrica => {
        healthDistribution[metrica.imcCategory] = (healthDistribution[metrica.imcCategory] || 0) + 1;
      });

      return {
        totalUsers: users.length,
        averageAge: Math.round(totalAge / users.length),
        averageIMC: Math.round((totalIMC / users.length) * 100) / 100,
        healthDistribution
      };
    } catch (error) {
      console.error('Error obteniendo resumen de usuarios:', error);
      throw error;
    }
  }
}

export const healthCoachService = new HealthCoachService();