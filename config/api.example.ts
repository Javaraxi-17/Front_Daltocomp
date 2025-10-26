// Archivo de ejemplo para configuración de API
// Copia este archivo como 'api.ts' y reemplaza los valores

// Configuración de API para diferentes entornos
export const API_CONFIG = {
  // Para desarrollo local (cuando usas emulador en la misma máquina)
  LOCAL: 'http://localhost:4000',
  
  // Para desarrollo con dispositivo físico o emulador en red
  NETWORK: 'http://10.41.41.109:4000',
  
  // Para producción (cuando despliegues en un servidor)
  PRODUCTION: 'https://tu-servidor.com/api'
};

// Cambia esta variable según tu entorno
export const CURRENT_ENV = 'NETWORK'; // 'LOCAL' | 'NETWORK' | 'PRODUCTION'

export const API_BASE_URL = API_CONFIG[CURRENT_ENV];

// Configuración de Google AI Studio
export const GOOGLE_AI_CONFIG = {
  // ⚠️ IMPORTANTE: Reemplaza con tu API key real de Google AI Studio
  // Obtén tu API key de: https://aistudio.google.com/app/api-keys
  API_KEY: 'TU_API_KEY_REAL_AQUI', // ← Cambia esto por tu API key
  
  // URL base de la API de Google AI
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
};

// Ejemplo de API key (NO USES ESTA, ES SOLO UN EJEMPLO):
// API_KEY: 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'


