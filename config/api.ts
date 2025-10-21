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
