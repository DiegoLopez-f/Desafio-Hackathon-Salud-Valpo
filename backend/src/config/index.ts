import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno explícitamente
// Intentar múltiples ubicaciones para el archivo .env
const envPaths = [
  path.join(__dirname, '..', '..', '.env'), // desde src/config hacia raíz del proyecto
  path.join(process.cwd(), '.env'), // desde el directorio de trabajo actual
  '.env' // relativo al directorio actual
];

let envLoaded = false;
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`✅ Archivo .env cargado desde: ${envPath}`);
    envLoaded = true;
    break;
  } else {
    console.log(`❌ No se pudo cargar .env desde: ${envPath}`);
  }
}

if (!envLoaded) {
  console.error('❌ No se pudo encontrar el archivo .env en ninguna ubicación');
}

// Debug: mostrar todas las variables de entorno que empiecen con OPENAI
console.log('🔍 Debug - Variables de entorno:');
console.log('- Directorio actual:', process.cwd());
console.log('- __dirname:', __dirname);
console.log('- Todas las env vars que empiecen con OPENAI:');
Object.keys(process.env)
  .filter(key => key.startsWith('OPENAI'))
  .forEach(key => console.log(`  ${key}: ${process.env[key] ? '✓ Configurada' : '✗ Vacía'}`));

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  chromaHost: process.env.CHROMA_HOST || 'localhost',
  chromaPort: process.env.CHROMA_PORT || '8000',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'desafio-salud-valpo'
};

// Validar configuración crítica
if (!config.openaiApiKey) {
  console.error('❌ Error de configuración:');
  console.error('OPENAI_API_KEY no está configurada');
  console.error('Valor actual:', config.openaiApiKey);
  console.error('Verifica que el archivo .env existe y contiene la API key');
  process.exit(1);
}

console.log('✅ Configuración cargada correctamente:');
console.log(`- Puerto: ${config.port}`);
console.log(`- Entorno: ${config.nodeEnv}`);
console.log(`- OpenAI API Key: ${config.openaiApiKey ? '✓ Configurada' : '✗ Faltante'}`);
console.log(`- Frontend URL: ${config.frontendUrl}`);
console.log(`- Firebase Project: ${config.firebaseProjectId}`);