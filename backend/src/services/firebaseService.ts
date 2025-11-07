import admin from 'firebase-admin';

interface UserData {
  id: string;
  nombre: string;
  edad: number;
  altura: number; // en cm
  peso: number;   // en kg
}

class FirebaseService {
  private db: any;
  private isInitialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Para desarrollo, usar directamente el mock para evitar problemas de autenticación
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Modo desarrollo detectado - usando datos mock');
        this.createMockFirestore();
        return;
      }

      // Solo para producción intentar conectar a Firebase real
      if (admin.apps.length === 0) {
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (serviceAccount) {
          admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
            projectId: process.env.FIREBASE_PROJECT_ID,
          });
        } else {
          throw new Error('FIREBASE_SERVICE_ACCOUNT no configurado para producción');
        }
      }

      this.db = admin.firestore();
      this.isInitialized = true;
      console.log('✅ Firebase inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      // Fallback a mock
      this.createMockFirestore();
    }
  }

  private createMockFirestore() {
    console.log('🔄 Usando datos mock para desarrollo/testing');
    console.log('💡 Tip: Para usar datos reales, asegúrate de tener usuarios en la colección "users" de Firebase');
    
    // Mock para desarrollo con datos de ejemplo
    const mockUsers = new Map<string, UserData>([
      ['user123', {
        id: 'user123',
        nombre: 'Juan Pérez',
        edad: 35,
        altura: 165,
        peso: 80
      }],
      ['user456', {
        id: 'user456',
        nombre: 'María García',
        edad: 28,
        altura: 160,
        peso: 65
      }],
      ['user789', {
        id: 'user789',
        nombre: 'Carlos Rodríguez',
        edad: 42,
        altura: 175,
        peso: 90
      }],
      ['user001', {
        id: 'user001',
        nombre: 'Ana López',
        edad: 30,
        altura: 155,
        peso: 58
      }],
      ['user002', {
        id: 'user002',
        nombre: 'Pedro Martínez',
        edad: 45,
        altura: 180,
        peso: 95
      }]
    ]);

    // Mock del servicio Firestore
    this.db = {
      collection: (collectionName: string) => ({
        doc: (docId: string) => ({
          get: async () => {
            const userData = mockUsers.get(docId);
            return {
              exists: !!userData,
              data: () => userData,
              id: docId
            };
          }
        }),
        get: async () => ({
          docs: Array.from(mockUsers.values()).map(user => ({
            id: user.id,
            data: () => user,
            exists: true
          }))
        })
      })
    } as any;

    this.isInitialized = true;
  }

  async getUserById(userId: string): Promise<UserData | null> {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase no está inicializado');
      }

      const userDoc = await this.db.collection('users').doc(userId).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data() as Omit<UserData, 'id'>;
        return {
          id: userDoc.id,
          ...userData
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserData[]> {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase no está inicializado');
      }

      const usersSnapshot = await this.db.collection('users').get();
      const users: UserData[] = [];

      usersSnapshot.docs.forEach((doc: any) => {
        users.push({
          id: doc.id,
          ...doc.data() as Omit<UserData, 'id'>
        });
      });

      return users;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  }

  // Método para calcular métricas de salud
  calculateHealthMetrics(userData: UserData) {
    const { peso, altura, edad } = userData;
    
    // Calcular IMC
    const imc = peso / Math.pow(altura / 100, 2);
    
    // Clasificación IMC
    let imcCategory = '';
    if (imc < 18.5) {
      imcCategory = 'Bajo peso';
    } else if (imc < 25) {
      imcCategory = 'Peso normal';
    } else if (imc < 30) {
      imcCategory = 'Sobrepeso';
    } else {
      imcCategory = 'Obesidad';
    }
    
    // Peso ideal aproximado (fórmula de Lorentz)
    const pesoIdeal = altura - 100 - ((altura - 150) / 4);
    const diferenciaPeso = peso - pesoIdeal;
    
    // Metabolismo basal aproximado (fórmula de Harris-Benedict simplificada)
    const metabolismoBasal = Math.round(
      655 + (9.6 * peso) + (1.8 * altura) - (4.7 * edad)
    );
    
    // Requerimiento calórico diario (factor de actividad sedentaria)
    const caloriasDiarias = Math.round(metabolismoBasal * 1.4);

    return {
      imc: Math.round(imc * 100) / 100,
      imcCategory,
      pesoIdeal: Math.round(pesoIdeal * 100) / 100,
      diferenciaPeso: Math.round(diferenciaPeso * 100) / 100,
      metabolismoBasal,
      caloriasDiarias,
      evaluacion: this.getHealthEvaluation(imc, edad)
    };
  }

  private getHealthEvaluation(imc: number, edad: number): string {
    if (imc < 18.5) {
      return 'Tu IMC indica bajo peso. Es recomendable consultar con un nutricionista.';
    } else if (imc < 25) {
      return '¡Excelente! Tienes un peso saludable. Mantén tus hábitos actuales.';
    } else if (imc < 30) {
      return 'Tienes sobrepeso leve. Con pequeños cambios puedes alcanzar tu peso ideal.';
    } else {
      return 'Te recomendamos consultar con un profesional de salud para un plan personalizado.';
    }
  }
}

export const firebaseService = new FirebaseService();