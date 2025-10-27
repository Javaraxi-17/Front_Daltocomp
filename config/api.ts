// Configuración de API para diferentes entornos
export const API_CONFIG = {
  // Para desarrollo local (cuando usas emulador en la misma máquina)
  LOCAL: 'http://localhost:4000',
  
  // Para desarrollo con dispositivo físico o emulador en red
  NETWORK: 'http://192.168.1.5:4000',
  
  // Para producción (cuando despliegues en un servidor)
  PRODUCTION: 'https://tu-servidor.com/api'
};

// Cambia esta variable según tu entorno
export const CURRENT_ENV = 'NETWORK'; // 'LOCAL' | 'NETWORK' | 'PRODUCTION'

export const API_BASE_URL = API_CONFIG[CURRENT_ENV];

// Configuración de Google AI Studio
export const GOOGLE_AI_CONFIG = {
  // Reemplaza con tu API key de Google AI Studio
  API_KEY: 'AIzaSyBbrFE4nCzxHOz_-Ei3ug9ERxVlbvXdK8o', // Obtén tu API key de: https://aistudio.google.com/app/api-keys
  
  // URL base de la API de Google AI - Usando Gemini 2.5 Flash (más rápido e inteligente)
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};
